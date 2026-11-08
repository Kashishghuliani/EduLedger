import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiLogOut,
  FiUser,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiArrowRight,
  FiX,
  FiShield,
  FiRefreshCw,
  FiUsers,
  FiActivity,
  FiBell,
  FiChevronDown
} from "react-icons/fi";

import api from "../api/axios";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  })}`;

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

function ParentPortal() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [ledgers, setLedgers] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const [parentName, setParentName] = useState("Parent");

  // -----------------------------------
  // FETCH PARENT PROFILE
  // -----------------------------------
  const fetchParentProfile = async () => {
    try {
      const response = await api.get("/auth/me/");
      setParentName(
        response.data.first_name ||
        response.data.username ||
        "Parent"
      );
    } catch (error) {
      console.error("Unable to load parent profile:", error);
    }
  };

  // -----------------------------------
  // FETCH STUDENTS AND FEE LEDGERS
  // -----------------------------------
  const fetchPortalData = async () => {
    try {
      setPageError("");

      const response = await api.get("/students/");
      const studentList = response.data.results || response.data;

      if (!Array.isArray(studentList)) {
        throw new Error("Invalid students response.");
      }

      setStudents(studentList);

      const ledgerResults = await Promise.all(
        studentList.map(async (student) => {
          try {
            const ledgerResponse = await api.get(
              `/fees/ledger/${student.id}/`
            );

            return [student.id, ledgerResponse.data];
          } catch (error) {
            console.error(
              `Unable to load ledger for ${student.name}:`,
              error
            );

            return [student.id, null];
          }
        })
      );

      const ledgerMap = Object.fromEntries(ledgerResults);
      setLedgers(ledgerMap);
    } catch (error) {
      console.error("Unable to load parent portal:", error);
      setPageError("Unable to load your fee details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // FETCH PARENT NOTIFICATIONS
  // -----------------------------------
  const fetchReminders = async () => {
    try {
      setNotificationsLoading(true);
      setNotificationError("");

      const response = await api.get("/reminders/");

      const reminderList =
        response.data.results || response.data;

      setReminders(
        Array.isArray(reminderList) ? reminderList : []
      );
    } catch (error) {
      console.error("Unable to load notifications:", error);

      setNotificationError(
        "Unable to load notifications. Please try again."
      );

      setReminders([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchParentProfile();
    fetchPortalData();
    fetchReminders();
  }, []);

  // -----------------------------------
  // LOGOUT
  // -----------------------------------
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  // -----------------------------------
  // SUMMARY CALCULATIONS
  // -----------------------------------
  const allInstallments = Object.values(ledgers)
    .filter(Boolean)
    .flatMap((ledger) => ledger.installments || []);

  const totalFee = Object.values(ledgers)
    .filter(Boolean)
    .reduce(
      (sum, ledger) => sum + Number(ledger.payable_amount || 0),
      0
    );

  const totalPaid = Object.values(ledgers)
    .filter(Boolean)
    .reduce(
      (sum, ledger) => sum + Number(ledger.total_paid || 0),
      0
    );

  const totalOutstanding = Object.values(ledgers)
    .filter(Boolean)
    .reduce(
      (sum, ledger) => sum + Number(ledger.outstanding || 0),
      0
    );

  const pendingInstallments = allInstallments.filter(
    (item) =>
      Number(item.balance || 0) > 0 &&
      item.status !== "PAID"
  ).length;

  const pendingNotifications = reminders.filter(
    (reminder) => reminder.status === "PENDING"
  ).length;

  // -----------------------------------
  // PAYMENT MODAL
  // -----------------------------------
  const openPaymentModal = (installment) => {
    setSelectedInstallment(installment);
    setPaymentAmount(String(installment.balance || 0));
    setPaymentError("");
    setPaymentSuccess(null);
  };

  const closePaymentModal = () => {
    if (paymentLoading) return;

    setSelectedInstallment(null);
    setPaymentAmount("");
    setPaymentError("");
    setPaymentSuccess(null);
  };

  // -----------------------------------
  // MOCK PAYMENT
  // -----------------------------------
  const handlePayment = async (event) => {
    event.preventDefault();

    if (!selectedInstallment) return;

    const amount = Number(paymentAmount);
    const balance = Number(selectedInstallment.balance || 0);

    if (!amount || amount <= 0) {
      setPaymentError("Please enter a valid payment amount.");
      return;
    }

    if (amount > balance) {
      setPaymentError(
        `Payment cannot exceed the outstanding amount of ${money(balance)}.`
      );
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError("");

      const response = await api.post("/payments/mock/", {
        installment_id: selectedInstallment.id,
        amount,
        idempotency_key: crypto.randomUUID(),
        simulate_success: true
      });

      setPaymentSuccess({
        message: response.data.message || "Payment completed successfully.",
        reference:
          response.data.reference_id ||
          response.data.payment?.reference_id ||
          "Generated successfully"
      });

      await fetchPortalData();
      await fetchReminders();
    } catch (error) {
      console.error("Payment failed:", error);

      setPaymentError(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Payment could not be completed. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // -----------------------------------
  // INSTALLMENT STATUS
  // -----------------------------------
  const getInstallmentStatus = (installment) => {
    if (installment.display_status) {
      return installment.display_status;
    }

    if (Number(installment.balance || 0) <= 0) {
      return "PAID";
    }

    return installment.status || "PENDING";
  };

  const getStatusClass = (status) => {
    return String(status || "pending").toLowerCase();
  };

  // -----------------------------------
  // NOTIFICATION STATUS
  // -----------------------------------
  const getReminderStatusLabel = (status) => {
    const labels = {
      PENDING: "Pending",
      SENT: "Sent",
      SKIPPED: "Skipped"
    };

    return labels[status] || status;
  };

  // -----------------------------------
  // LOADING STATE
  // -----------------------------------
  if (loading) {
    return (
      <div className="parent-loading">
        <FiRefreshCw className="loading-spinner" />
        <p>Loading your fee details...</p>
      </div>
    );
  }

  // -----------------------------------
  // MAIN PORTAL
  // -----------------------------------
  return (
    <div className="parent-portal">
      {/* HEADER */}
      <header className="parent-header">
        <div className="parent-header-left">
          <div className="parent-brand-icon">
            <FiBookOpen />
          </div>

          <div className="parent-brand-text">
            <h2>EduLedger</h2>
            <span>Parent Portal</span>
          </div>
        </div>

        <div className="parent-header-right">

          {/* NOTIFICATION BELL */}
          <div className="parent-notification-wrapper">
            <button
              type="button"
              className={`notification-bell-button ${
                showNotifications ? "active" : ""
              }`}
              onClick={() =>
                setShowNotifications((previous) => !previous)
              }
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <FiBell />

              {pendingNotifications > 0 && (
                <span className="notification-count">
                  {pendingNotifications > 99
                    ? "99+"
                    : pendingNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="notification-overlay"
                  onClick={() => setShowNotifications(false)}
                />

                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>
                        {reminders.length} fee reminder
                        {reminders.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="notification-close"
                      onClick={() => setShowNotifications(false)}
                      aria-label="Close notifications"
                    >
                      <FiX />
                    </button>
                  </div>

                  {notificationError && (
                    <div className="notification-error">
                      <span>{notificationError}</span>

                      <button
                        type="button"
                        onClick={fetchReminders}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {notificationsLoading ? (
                    <div className="notification-empty">
                      <FiRefreshCw className="loading-spinner" />
                      <p>Loading notifications...</p>
                    </div>
                  ) : reminders.length === 0 ? (
                    <div className="notification-empty">
                      <FiBell />
                      <h4>No notifications yet</h4>
                      <p>
                        Fee reminders will appear here when
                        they are generated by the institute.
                      </p>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {reminders.map((reminder) => (
                        <div
                          className="notification-item"
                          key={reminder.id}
                        >
                          <div className="notification-item-top">
                            <div className="notification-item-icon">
                              <FiCreditCard />
                            </div>

                            <span
                              className={`notification-status ${getStatusClass(
                                reminder.status
                              )}`}
                            >
                              {getReminderStatusLabel(
                                reminder.status
                              )}
                            </span>
                          </div>

                          <h4>
                            {reminder.student_name ||
                              "Student fee reminder"}
                          </h4>

                          <p className="notification-message">
                            {reminder.message}
                          </p>

                          <div className="notification-item-footer">
                            <span>
                              <FiCalendar />
                              {formatDateTime(
                                reminder.scheduled_for
                              )}
                            </span>

                            {reminder.balance !== null &&
                              reminder.balance !== undefined && (
                                <strong>
                                  Due: {money(reminder.balance)}
                                </strong>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="notification-dropdown-footer">
                    <span>
                      <FiShield />
                      Fee reminders for your linked students
                    </span>

                    <button
                      type="button"
                      onClick={fetchReminders}
                      disabled={notificationsLoading}
                      aria-label="Refresh notifications"
                    >
                      <FiRefreshCw />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PARENT ACCOUNT */}
          <div className="parent-header-account">
            <div className="parent-avatar">
              <FiUser />
            </div>

            <div className="parent-account-info">
              <strong>{parentName}</strong>
              <span>Parent Account</span>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="parent-logout-button"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="parent-main">

        {/* WELCOME SECTION */}
        <section className="parent-welcome">
          <div>
            <span className="parent-eyebrow">
              <FiActivity />
              YOUR ACCOUNT OVERVIEW
            </span>

            <h1>Welcome back, {parentName}!</h1>

            <p>
              Track your children's fee payments, outstanding
              installments and payment history.
            </p>
          </div>

          <div className="parent-welcome-icon">
            <FiUsers />
          </div>
        </section>

        {/* ERROR MESSAGE */}
        {pageError && (
          <div className="parent-error-message">
            <FiAlertCircle />
            <span>{pageError}</span>

            <button
              type="button"
              onClick={fetchPortalData}
            >
              Retry
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <section className="parent-summary-grid">
          <div className="parent-summary-card">
            <div className="parent-summary-icon blue">
              <FiBookOpen />
            </div>

            <div>
              <span>Total Fee</span>
              <h2>{money(totalFee)}</h2>
            </div>
          </div>

          <div className="parent-summary-card">
            <div className="parent-summary-icon green">
              <FiCheckCircle />
            </div>

            <div>
              <span>Total Paid</span>
              <h2>{money(totalPaid)}</h2>
            </div>
          </div>

          <div className="parent-summary-card">
            <div className="parent-summary-icon orange">
              <FiAlertCircle />
            </div>

            <div>
              <span>Outstanding</span>
              <h2>{money(totalOutstanding)}</h2>
            </div>
          </div>

          <div className="parent-summary-card">
            <div className="parent-summary-icon purple">
              <FiClock />
            </div>

            <div>
              <span>Pending Installments</span>
              <h2>{pendingInstallments}</h2>
            </div>
          </div>
        </section>

        {/* STUDENT SECTION */}
        <section className="parent-students-section">
          <div className="parent-section-heading">
            <div>
              <h2>My Students</h2>
              <p>
                Fee details and payment information for your
                linked students.
              </p>
            </div>

            <span className="parent-student-count">
              <FiUsers />
              {students.length} Student
              {students.length !== 1 ? "s" : ""}
            </span>
          </div>

          {students.length === 0 ? (
            <div className="parent-empty-state">
              <FiUsers />
              <h3>No students linked</h3>
              <p>
                Please contact the institute to link a student
                to your parent account.
              </p>
            </div>
          ) : (
            <div className="parent-student-list">
              {students.map((student) => {
                const ledger = ledgers[student.id];

                const installments =
                  ledger?.installments || [];

                return (
                  <div
                    className="parent-student-card"
                    key={student.id}
                  >
                    {/* STUDENT HEADER */}
                    <div className="parent-student-card-header">
                      <div className="student-info">
                        <div className="student-avatar">
                          <FiUser />
                        </div>

                        <div>
                          <h3>{student.name}</h3>

                          <p>
                            Student ID: {student.student_id}
                          </p>

                          <span>
                            {student.batch_name ||
                              student.batch?.name ||
                              "Batch not available"}
                          </span>
                        </div>
                      </div>

                      <div className="student-attendance">
                        <FiActivity />
                        <span>
                          {student.attendance_percentage ?? 0}%
                          Attendance
                        </span>
                      </div>
                    </div>

                    {/* FEE SUMMARY */}
                    {!ledger ? (
                      <div className="student-no-ledger">
                        <FiAlertCircle />
                        <span>
                          Fee ledger is not available for this
                          student yet.
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="student-fee-summary">
                          <div>
                            <span>Payable Fee</span>
                            <strong>
                              {money(ledger.payable_amount)}
                            </strong>
                          </div>

                          <div>
                            <span>Paid</span>
                            <strong className="paid-amount">
                              {money(ledger.total_paid)}
                            </strong>
                          </div>

                          <div>
                            <span>Outstanding</span>
                            <strong className="outstanding-amount">
                              {money(ledger.outstanding)}
                            </strong>
                          </div>
                        </div>

                        {/* INSTALLMENTS */}
                        <div className="parent-installments-section">
                          <div className="installments-heading">
                            <h4>Installment Details</h4>

                            <span>
                              {installments.length} Installments
                            </span>
                          </div>

                          {installments.length === 0 ? (
                            <div className="no-installments">
                              No installments have been added.
                            </div>
                          ) : (
                            <div className="parent-installment-table-wrapper">
                              <table className="parent-installment-table">
                                <thead>
                                  <tr>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Paid</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {installments.map(
                                    (installment) => {
                                      const status =
                                        getInstallmentStatus(
                                          installment
                                        );

                                      const balance = Number(
                                        installment.balance || 0
                                      );

                                      return (
                                        <tr key={installment.id}>
                                          <td>
                                            {formatDate(
                                              installment.due_date
                                            )}
                                          </td>

                                          <td>
                                            {money(
                                              installment.amount
                                            )}
                                          </td>

                                          <td className="paid-amount">
                                            {money(
                                              installment.paid_amount
                                            )}
                                          </td>

                                          <td className="outstanding-amount">
                                            {money(balance)}
                                          </td>

                                          <td>
                                            <span
                                              className={`installment-status ${getStatusClass(
                                                status
                                              )}`}
                                            >
                                              {status}
                                            </span>
                                          </td>

                                          <td>
                                            {balance > 0 &&
                                            status !== "PAID" ? (
                                              <button
                                                type="button"
                                                className="parent-pay-button"
                                                onClick={() =>
                                                  openPaymentModal(
                                                    installment
                                                  )
                                                }
                                              >
                                                Pay Now
                                                <FiArrowRight />
                                              </button>
                                            ) : (
                                              <span className="payment-complete">
                                                <FiCheckCircle />
                                                Paid
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="parent-footer">
          <div>
            <FiShield />
            <span>Secure Parent Portal</span>
          </div>

          <p>
            EduLedger · Fee management made simple
          </p>
        </footer>
      </main>

      {/* PAYMENT MODAL */}
      {selectedInstallment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">

            <div className="payment-modal-header">
              <div>
                <h2>
                  {paymentSuccess
                    ? "Payment Successful"
                    : "Make a Payment"}
                </h2>

                <p>
                  {paymentSuccess
                    ? "Your payment has been recorded."
                    : "Complete your installment payment."}
                </p>
              </div>

              {!paymentLoading && (
                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="payment-modal-close"
                  aria-label="Close payment modal"
                >
                  <FiX />
                </button>
              )}
            </div>

            {paymentSuccess ? (
              <div className="payment-success-content">
                <div className="payment-success-icon">
                  <FiCheckCircle />
                </div>

                <h3>Payment completed!</h3>

                <p>{paymentSuccess.message}</p>

                <div className="payment-reference">
                  <span>Payment Reference</span>
                  <strong>{paymentSuccess.reference}</strong>
                </div>

                <button
                  type="button"
                  className="payment-submit-button"
                  onClick={closePaymentModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayment}>
                <div className="payment-detail-box">
                  <div>
                    <span>Installment Amount</span>
                    <strong>
                      {money(selectedInstallment.amount)}
                    </strong>
                  </div>

                  <div>
                    <span>Already Paid</span>
                    <strong className="paid-amount">
                      {money(selectedInstallment.paid_amount)}
                    </strong>
                  </div>

                  <div>
                    <span>Outstanding Balance</span>
                    <strong className="outstanding-amount">
                      {money(selectedInstallment.balance)}
                    </strong>
                  </div>
                </div>

                <label htmlFor="payment-amount">
                  Payment Amount
                </label>

                <div className="payment-input-wrapper">
                  <span>₹</span>

                  <input
                    id="payment-amount"
                    type="number"
                    min="0.01"
                    max={Number(selectedInstallment.balance)}
                    step="0.01"
                    value={paymentAmount}
                    onChange={(event) =>
                      setPaymentAmount(event.target.value)
                    }
                    required
                    disabled={paymentLoading}
                    placeholder="Enter amount"
                  />
                </div>

                {paymentError && (
                  <div className="payment-error">
                    <FiAlertCircle />
                    {paymentError}
                  </div>
                )}

                <div className="mock-payment-notice">
                  <FiShield />
                  <span>
                    Demo payment mode. No real money will be
                    transferred.
                  </span>
                </div>

                <button
                  type="submit"
                  className="payment-submit-button"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <FiRefreshCw className="loading-spinner" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {money(paymentAmount)}
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentPortal;