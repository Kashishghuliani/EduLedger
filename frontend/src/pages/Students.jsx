
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiCreditCard,
  FiBell,
  FiAlertTriangle,
  FiLogOut,
  FiPlus,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../api/axios";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function getErrorMessage(err) {
  const data = err.response?.data;

  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  return Object.entries(data)
    .map(([field, messages]) => {
      const message = Array.isArray(messages)
        ? messages.join(", ")
        : typeof messages === "object"
        ? JSON.stringify(messages)
        : messages;

      return `${field}: ${message}`;
    })
    .join(" | ");
}

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLedger, setSelectedLedger] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students/");

      setStudents(response.data.results || response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchLedger = async (student) => {
    try {
      setError("");
      setSuccess("");
      setLedgerLoading(true);

      setSelectedStudent(student);
      setSelectedLedger(null);
      setShowCreateForm(false);

      const response = await api.get(
        `/fees/ledger/${student.id}/`
      );

      setSelectedLedger(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setSelectedLedger(null);
        setShowCreateForm(true);
      } else {
        setError(getErrorMessage(err));
        setSelectedStudent(null);
      }
    } finally {
      setLedgerLoading(false);
    }
  };

  const openCreateFeePlan = (student) => {
    setError("");
    setSuccess("");
    setSelectedStudent(student);
    setSelectedLedger(null);
    setShowCreateForm(true);
  };

  const closeFeeManagement = () => {
    setSelectedStudent(null);
    setSelectedLedger(null);
    setShowCreateForm(false);
    setError("");
    setSuccess("");
  };

  const handleFeePlanSuccess = async () => {
    setShowCreateForm(false);
    setSuccess("Fee plan created successfully.");

    await fetchLedger(selectedStudent);
    await fetchStudents();
  };

  return (
    <div className="dashboard-page students-page">

      {/* DASHBOARD HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <FiBookOpen />
          </div>

          <div>
            <h1>EduLedger</h1>
            <p>Accounts Executive Portal</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button
            className="dashboard-nav-button active"
            onClick={() => navigate("/students")}
          >
            <FiUsers />
            <span>Students</span>
          </button>

          <button
            className="dashboard-nav-button"
            onClick={() => navigate("/management")}
          >
            <FiBriefcase />
            <span>Accounts Management</span>
          </button>

          <button
            className="dashboard-nav-button"
            onClick={() => navigate("/refunds")}
          >
            <FiCreditCard />
            <span>Refunds</span>
          </button>

          <button
            className="dashboard-nav-button"
            onClick={() => navigate("/reminders")}
          >
            <FiBell />
            <span>Reminders</span>
          </button>

          <button
            className="dashboard-nav-button"
            onClick={() => navigate("/risk")}
          >
            <FiAlertTriangle />
            <span>Risk Monitoring</span>
          </button>

          <button
            className="dashboard-nav-button logout-button"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {/* STUDENTS CONTENT */}
      <main className="dashboard-content students-content">

        <div className="page-heading students-page-heading">
          <div>
            <span className="students-eyebrow">
              STUDENT MANAGEMENT
            </span>

            <h2>Student Management</h2>

            <p className="section-description">
              View students and manage their fee records.
            </p>
          </div>

          <button
            onClick={fetchStudents}
            className="secondary-button"
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {success && (
          <p className="success-message">{success}</p>
        )}

        {loading ? (
          <p className="page-message">
            Loading students...
          </p>
        ) : (
          <section className="table-card students-table-card">

            <div className="students-table-heading">
              <div>
                <h3>Students</h3>

                <p>
                  View student details and manage fee plans
                  and installments.
                </p>
              </div>

              <span className="students-record-count">
                {students.length} Records
              </span>
            </div>

            <div className="responsive-table">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Attendance</th>
                    <th>Status</th>
                    <th>Fee Management</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>

                      <td className="student-name-cell">
                        {student.name}
                      </td>

                      <td>
                        {student.batch_name || student.batch}
                      </td>

                      <td>
                        {student.attendance_percentage}%
                      </td>

                      <td>
                        <span
                          className={`student-status ${
                            student.active
                              ? "student-active"
                              : "student-inactive"
                          }`}
                        >
                          {student.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <div className="student-action-buttons">
                          <button
                            className="small-button"
                            onClick={() => fetchLedger(student)}
                            disabled={ledgerLoading}
                          >
                            <FiEye />
                            View Ledger
                          </button>

                          <button
                            className="small-button fee-create-button"
                            onClick={() => openCreateFeePlan(student)}
                          >
                            <FiPlus />
                            Create Fee Plan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {students.length === 0 && (
                    <tr>
                      <td colSpan="6" className="students-empty">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {ledgerLoading && (
          <p className="page-message">
            Loading fee ledger...
          </p>
        )}

        {/* FEE MANAGEMENT */}
        {selectedStudent && !ledgerLoading && (
          <section className="ledger-card">

            <div className="ledger-heading">
              <div>
                <span className="students-eyebrow">
                  FEE MANAGEMENT
                </span>

                <h2>
                  {selectedLedger ? "Fee Ledger" : "Create Fee Plan"}
                </h2>

                <p>
                  {selectedStudent.name} — {selectedStudent.student_id}
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={closeFeeManagement}
              >
                Close
              </button>
            </div>

            {selectedLedger ? (
              <FeeLedger ledger={selectedLedger} />
            ) : showCreateForm ? (
              <>
                <div className="fee-plan-intro">
                  <h3>Create Fee Plan</h3>

                  <p>
                    No fee ledger was found for this student.
                    Create a fee plan and define the installment schedule.
                  </p>
                </div>

                <CreateFeePlan
                  studentId={selectedStudent.id}
                  onSuccess={handleFeePlanSuccess}
                  onCancel={() => setShowCreateForm(false)}
                />
              </>
            ) : (
              <button
                className="small-button"
                onClick={() => setShowCreateForm(true)}
              >
                <FiPlus />
                Create Fee Plan
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}


/* =====================================
   FEE LEDGER
===================================== */

function FeeLedger({ ledger }) {
  return (
    <div className="fee-ledger-content">

      <div className="stats-grid">

        <div className="stat-card">
          <p className="stat-title">Total Fee</p>
          <h2>₹{formatCurrency(ledger.total_fee)}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Discount</p>
          <h2>₹{formatCurrency(ledger.discount)}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Paid</p>
          <h2>₹{formatCurrency(ledger.total_paid)}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-title">Outstanding</p>
          <h2>₹{formatCurrency(ledger.outstanding)}</h2>
        </div>

      </div>

      <div className="table-card ledger-table-card">

        <div className="ledger-table-heading">
          <div>
            <h3>Installments</h3>

            <p>
              Track due dates, payments and outstanding balances.
            </p>
          </div>
        </div>

        <div className="responsive-table">
          <table className="students-table instalments-table">

            <thead>
              <tr>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Days Overdue</th>
              </tr>
            </thead>

            <tbody>
              {ledger.installments?.map((item) => (
                <tr key={item.id}>
                  <td>{item.due_date}</td>

                  <td>₹{formatCurrency(item.amount)}</td>

                  <td>₹{formatCurrency(item.paid_amount)}</td>

                  <td>₹{formatCurrency(item.balance)}</td>
              
                  <td>
                    <span
                      className={`installment-status ${
                        (item.display_status || item.status).toLowerCase()
                      }`}
                    >
                      {item.display_status || item.status}
                    </span>
                  </td>


                  <td>{item.days_overdue}</td>
                </tr>
              ))}

              {!ledger.installments?.length && (
                <tr>
                  <td colSpan="6" className="students-empty">
                    No installments found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}


/* =====================================
   CREATE FEE PLAN
===================================== */

function CreateFeePlan({
  studentId,
  onSuccess,
  onCancel,
}) {
  const [totalFee, setTotalFee] = useState("");
  const [discount, setDiscount] = useState("0");

  const [installments, setInstallments] = useState([
    { amount: "", due_date: "" },
  ]);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateInstallment = (index, field, value) => {
    setInstallments((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addInstallment = () => {
    setInstallments((current) => [
      ...current,
      { amount: "", due_date: "" },
    ]);
  };

  const removeInstallment = (index) => {
    setInstallments((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const installmentTotal = installments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const payableAmount =
    Number(totalFee || 0) - Number(discount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fee = Number(totalFee);
    const discountValue = Number(discount);

    if (!Number.isFinite(fee) || fee <= 0) {
      setError("Enter a valid total fee greater than zero.");
      return;
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      discountValue >= fee
    ) {
      setError(
        "Discount must be zero or more, and less than the total fee."
      );
      return;
    }

    if (installments.length === 0) {
      setError("Add at least one installment.");
      return;
    }

    if (
      installments.some(
        (item) =>
          !item.amount ||
          Number(item.amount) <= 0 ||
          !item.due_date
      )
    ) {
      setError(
        "Enter a valid amount and due date for every installment."
      );
      return;
    }

    if (Math.abs(installmentTotal - payableAmount) > 0.001) {
      setError(
        `Installment total must equal ₹${formatCurrency(payableAmount)}. Current total: ₹${formatCurrency(installmentTotal)}.`
      );
      return;
    }

    setSaving(true);

    try {
      await api.post("/fees/plans/", {
        student: studentId,
        total_fee: fee,
        discount: discountValue,
        installments: installments.map((item) => ({
          amount: Number(item.amount),
          due_date: item.due_date,
        })),
      });

      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="fee-plan-form" onSubmit={handleSubmit}>

      <div className="fee-plan-heading">
        <h3>Fee Plan Details</h3>

        <p>
          Enter the student's total fee and installment schedule.
        </p>
      </div>

      <div className="fee-plan-fields">

        <div className="fee-plan-field">
          <label>Total Fee (₹)</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter total fee"
            value={totalFee}
            onChange={(e) => setTotalFee(e.target.value)}
            required
          />
        </div>

        <div className="fee-plan-field">
          <label>Discount (₹)</label>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>

      </div>

      <div className="fee-plan-calculation">
        <div>
          <span>Total Fee</span>
          <strong>₹{formatCurrency(totalFee)}</strong>
        </div>

        <div>
          <span>Discount</span>
          <strong>₹{formatCurrency(discount)}</strong>
        </div>

        <div>
          <span>Payable Amount</span>
          <strong>₹{formatCurrency(payableAmount)}</strong>
        </div>

        <div>
          <span>Installment Total</span>
          <strong>₹{formatCurrency(installmentTotal)}</strong>
        </div>
      </div>

      <h4 className="installment-form-title">
        Installment Schedule
      </h4>

      {installments.map((item, index) => (
        <div className="installment-input-row" key={index}>

          <div className="installment-number">
            {index + 1}
          </div>

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Installment amount"
            value={item.amount}
            onChange={(e) =>
              updateInstallment(index, "amount", e.target.value)
            }
            required
          />

          <input
            type="date"
            value={item.due_date}
            onChange={(e) =>
              updateInstallment(index, "due_date", e.target.value)
            }
            required
          />

          {installments.length > 1 && (
            <button
              type="button"
              className="remove-button"
              onClick={() => removeInstallment(index)}
            >
              Remove
            </button>
          )}

        </div>
      ))}

      <div className="fee-plan-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={addInstallment}
        >
          <FiPlus />
          Add Installment
        </button>

        <div className="fee-plan-submit-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Fee Plan"}
          </button>

        </div>
      </div>

      {error && (
        <p className="error-message fee-plan-error">
          {error}
        </p>
      )}

    </form>
  );
}

export default Students;
