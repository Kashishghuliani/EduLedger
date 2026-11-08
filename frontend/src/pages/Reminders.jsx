import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiCreditCard,
  FiBell,
  FiAlertTriangle,
  FiLogOut,
  FiRefreshCw,
  FiSend,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

import api from "../api/axios";

function Reminders() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [language, setLanguage] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch all reminder records.
  const fetchReminders = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/reminders/");

      const data = response.data.results || response.data;

      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Unable to load reminders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Generate reminders using the backend endpoint.
  const handleGenerateReminders = async () => {
    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const response = await api.post("/reminders/generate/");

      const message =
        response.data.details || response.data.message;

      setSuccess(message || "Reminder generation completed.");

      // Fetch newly generated reminders.
      await fetchReminders();

    } catch (err) {
      setError(
        err.response?.data?.details ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unable to generate reminders."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Refresh the reminder list.
  const handleRefresh = async () => {
    setLoading(true);
    setSuccess("");
    await fetchReminders();
  };

  // Summary counts.
  const pendingCount = reminders.filter(
    (item) => item.status === "PENDING"
  ).length;

  const sentCount = reminders.filter(
    (item) => item.status === "SENT"
  ).length;

  const skippedCount = reminders.filter(
    (item) => item.status === "SKIPPED"
  ).length;

  // Apply language and status filters.
  const filteredReminders = reminders.filter((item) => {
    const matchesLanguage =
      language === "ALL" || item.language === language;

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    return matchesLanguage && matchesStatus;
  });

  return (
    <div className="dashboard-page reminders-page">

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
            className="dashboard-nav-button"
            onClick={() => navigate("/refunds")}
          >
            <FiCreditCard />
            <span>Refunds</span>
          </button>

          <button
            className="dashboard-nav-button active"
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

      {/* REMINDERS CONTENT */}
      <main className="dashboard-content reminders-content">

        {/* PAGE HEADING */}
        <div className="page-heading">
          <div>
            <h2>Fee Reminders</h2>

            <p className="section-description">
              Manage automated fee reminder records and monitor their status.
            </p>
          </div>

          <div className="reminder-actions">
            <button
              className="secondary-button"
              onClick={handleRefresh}
              disabled={loading || generating}
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              className="primary-button"
              onClick={handleGenerateReminders}
              disabled={generating || loading}
            >
              <FiSend />
              {generating ? "Generating..." : "Generate Reminders"}
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <section className="reminder-summary">

          <div className="reminder-summary-card">
            <div className="reminder-summary-icon pending-icon">
              <FiClock />
            </div>

            <div>
              <p>Pending</p>
              <h3>{pendingCount}</h3>
            </div>
          </div>

          <div className="reminder-summary-card">
            <div className="reminder-summary-icon sent-icon">
              <FiCheckCircle />
            </div>

            <div>
              <p>Sent</p>
              <h3>{sentCount}</h3>
            </div>
          </div>

          <div className="reminder-summary-card">
            <div className="reminder-summary-icon skipped-icon">
              <FiXCircle />
            </div>

            <div>
              <p>Skipped</p>
              <h3>{skippedCount}</h3>
            </div>
          </div>

          <div className="reminder-summary-card">
            <div className="reminder-summary-icon total-icon">
              <FiBell />
            </div>

            <div>
              <p>Total Reminders</p>
              <h3>{reminders.length}</h3>
            </div>
          </div>

        </section>

        {/* FEEDBACK MESSAGES */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* FILTERS */}
        <div className="reminder-toolbar">

          <div className="reminder-filter">
            <label htmlFor="language-filter">
              Language
            </label>

            <select
              id="language-filter"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="ALL">All Languages</option>
              <option value="EN">English</option>
              <option value="HI">Hindi</option>
            </select>
          </div>

          <div className="reminder-filter">
            <label htmlFor="status-filter">
              Reminder Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SENT">Sent</option>
              <option value="SKIPPED">Skipped</option>
            </select>
          </div>

          <p className="reminder-result-count">
            Showing {filteredReminders.length} of {reminders.length} reminders
          </p>

        </div>

        {/* REMINDER LIST */}
        {loading ? (
          <div className="page-message">
            Loading reminders...
          </div>
        ) : (
          <section className="reminder-list">

            {filteredReminders.map((item) => (
              <article
                className="reminder-card"
                key={item.id}
              >

                <div className="page-heading">
                  <div>
                    <h3>
                      {item.student_name || "Student"}
                    </h3>

                    <p className="section-description">
                      {item.message_type} reminder ·{" "}
                      {item.language === "HI" ? "Hindi" : "English"}
                    </p>
                  </div>

                  <span
                    className={`status-pill status-${item.status?.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="reminder-message">
                  {item.message}
                </p>

                <p className="reminder-scheduled">
                  <FiClock />
                  {" "}Created/Scheduled:{" "}
                  {new Date(item.scheduled_for).toLocaleString("en-IN")}
                </p>

              </article>
            ))}

            {filteredReminders.length === 0 && (
              <div className="reminder-empty">
                <FiBell />

                <h3>
                  {reminders.length === 0
                    ? "No reminders available"
                    : "No matching reminders"}
                </h3>

                <p>
                  {reminders.length === 0
                    ? "Click Generate Reminders to check eligible fee installments and create reminder records."
                    : "Try changing the language or status filters."}
                </p>
              </div>
            )}

          </section>
        )}

        <p className="reminder-demo-note">
          Note: Reminder records are generated automatically based on installment
          due dates.
        </p>

      </main>
    </div>
  );
}

export default Reminders;