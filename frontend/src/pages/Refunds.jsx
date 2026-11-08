
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
} from "react-icons/fi";

import api from "../api/axios";

function Refunds() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const [form, setForm] = useState({
    student: "",
    course_start: "",
    course_end: "",
    withdrawal_date: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchData = async () => {
    try {
      const [studentResponse, refundResponse] = await Promise.all([
        api.get("/students/"),
        api.get("/refunds/"),
      ]);

      setStudents(
        studentResponse.data.results || studentResponse.data
      );

      setRefunds(
        refundResponse.data.results || refundResponse.data
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load refund data."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await api.post("/refunds/calculate/", {
        student: Number(form.student),
        course_start: form.course_start,
        course_end: form.course_end,
        withdrawal_date: form.withdrawal_date,
      });

      setResult(response.data);
      await fetchData();
    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Refund calculation failed."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page refunds-page">

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
            className="dashboard-nav-button"
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
            className="dashboard-nav-button active"
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

      {/* REFUNDS CONTENT */}
      <main className="dashboard-content refund-page">

        {/* PAGE HEADER */}
        <section className="refund-page-header">
          <div className="refund-page-title">
            <span className="refund-eyebrow">
              FEE MANAGEMENT
            </span>

            <h2>Refund Calculator</h2>

            <p className="section-description">
              Calculate a student's estimated refund based on course duration.
            </p>
          </div>
        </section>

        {/* REFUND CALCULATOR */}
        <section className="refund-section">
          <div className="refund-section-heading">
            <div>
              <h3>Calculate Refund</h3>
              <p>
                Enter student and course details to estimate the refund amount.
              </p>
            </div>
          </div>

          <form
            className="refund-form"
            onSubmit={handleCalculate}
          >
            <div className="refund-form-grid">

              <div className="refund-field">
                <label htmlFor="refund-student">Student</label>

                <select
                  id="refund-student"
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a student</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.student_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="refund-field">
                <label htmlFor="course-start">Course Start Date</label>

                <input
                  id="course-start"
                  type="date"
                  name="course_start"
                  value={form.course_start}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="refund-field">
                <label htmlFor="course-end">Course End Date</label>

                <input
                  id="course-end"
                  type="date"
                  name="course_end"
                  value={form.course_end}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="refund-field">
                <label htmlFor="withdrawal-date">Withdrawal Date</label>

                <input
                  id="withdrawal-date"
                  type="date"
                  name="withdrawal_date"
                  value={form.withdrawal_date}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {error && (
              <div className="refund-error">
                <span>{error}</span>
              </div>
            )}

            <div className="refund-form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Calculating..." : "Calculate Refund"}
              </button>
            </div>
          </form>
        </section>

        {/* CALCULATION RESULT */}
        {result && (
          <section className="refund-result">
            <div className="refund-result-heading">
              <div>
                <span className="refund-eyebrow">
                  CALCULATION COMPLETE
                </span>

                <h3>Refund Calculation Result</h3>
              </div>

              <span className="refund-result-status">
                {result.status}
              </span>
            </div>

            <div className="refund-result-grid">
              <div className="refund-result-item">
                <span>Amount Paid</span>
                <strong>₹{result.amount_paid}</strong>
              </div>

              <div className="refund-result-item refund-highlight">
                <span>Estimated Refund</span>
                <strong>₹{result.refund_amount}</strong>
              </div>

              <div className="refund-result-item">
                <span>Processing Deadline</span>
                <strong>{result.processing_deadline}</strong>
              </div>
            </div>
          </section>
        )}

        {/* REFUND RECORDS */}
        <section className="refund-records-section">
          <div className="refund-records-heading">
            <div>
              <h3>Refund Records</h3>
              <p>View and track all student refund calculations.</p>
            </div>

            <span className="refund-record-count">
              {refunds.length} Records
            </span>
          </div>

          <div className="table-card">
            <div className="responsive-table">
              <table className="refund-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Amount Paid</th>
                    <th>Refund Amount</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {refunds.map((refund) => (
                    <tr key={refund.id}>
                      <td className="refund-student-name">
                        {refund.student_name || refund.student}
                      </td>

                      <td>₹{refund.amount_paid}</td>

                      <td className="refund-amount">
                        ₹{refund.refund_amount}
                      </td>

                      <td>{refund.processing_deadline}</td>

                      <td>
                        <span className="refund-status">
                          {refund.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan="5" className="refund-empty">
                        No refund records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Refunds;
