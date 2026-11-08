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
  FiCheckCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";

import api from "../api/axios";

function RiskAssessment() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch students, assessments and counsellor tasks.
  const fetchData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const [
        studentResponse,
        assessmentResponse,
        taskResponse,
      ] = await Promise.all([
        api.get("/students/"),
        api.get("/risk/assessments/"),
        api.get("/risk/tasks/"),
      ]);

      const studentData =
        studentResponse.data.results || studentResponse.data;

      const assessmentData =
        assessmentResponse.data.results || assessmentResponse.data;

      const taskData =
        taskResponse.data.results || taskResponse.data;

      setStudents(Array.isArray(studentData) ? studentData : []);
      setAssessments(
        Array.isArray(assessmentData) ? assessmentData : []
      );
      setTasks(Array.isArray(taskData) ? taskData : []);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load risk assessment information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Keep only the latest assessment for each student.
  const latestAssessments = Object.values(
    assessments.reduce((latest, assessment) => {
      const studentId = assessment.student;

      if (!latest[studentId]) {
        latest[studentId] = assessment;
      } else {
        const currentDate = new Date(
          assessment.created_at || 0
        ).getTime();

        const previousDate = new Date(
          latest[studentId].created_at || 0
        ).getTime();

        if (currentDate >= previousDate) {
          latest[studentId] = assessment;
        }
      }

      return latest;
    }, {})
  );

  // Risk summary counts.
  const highRiskCount = latestAssessments.filter(
    (item) => item.level === "HIGH"
  ).length;

  const mediumRiskCount = latestAssessments.filter(
    (item) => item.level === "MEDIUM"
  ).length;

  const lowRiskCount = latestAssessments.filter(
    (item) => item.level === "LOW"
  ).length;

  const openTasksCount = tasks.filter(
    (task) => !task.completed
  ).length;

  // Assess an individual student.
  const assessStudent = async (studentId) => {
    try {
      setProcessingId(studentId);
      setError("");
      setSuccess("");

      await api.post(`/risk/assess/${studentId}/`);

      setSuccess("Risk assessment completed successfully.");

      await fetchData(false);

    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Risk assessment failed."
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Mark assessment as false positive.
  const markFalsePositive = async (assessmentId) => {
    try {
      setProcessingId(assessmentId);
      setError("");
      setSuccess("");

      await api.post(
        `/risk/false-positive/${assessmentId}/`
      );

      setSuccess("Assessment marked as a false positive.");

      await fetchData(false);

    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to update assessment."
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Complete counsellor task.
  const completeTask = async (taskId) => {
    try {
      setProcessingId(taskId);
      setError("");
      setSuccess("");

      await api.patch(`/risk/tasks/${taskId}/`, {
        completed: true,
      });

      setSuccess("Counsellor task completed successfully.");

      await fetchData(false);

    } catch (err) {
      setError(
        JSON.stringify(
          err.response?.data || "Unable to complete task."
        )
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setSuccess("");
    await fetchData(false);
  };

  // Format risk reasons.
  const getReasons = (reasons) => {
    if (Array.isArray(reasons)) {
      return reasons;
    }

    if (typeof reasons === "string" && reasons.trim()) {
      return [reasons];
    }

    return [];
  };

  return (
    <div className="dashboard-page risk-page">

      {/* HEADER */}
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
            className="dashboard-nav-button"
            onClick={() => navigate("/reminders")}
          >
            <FiBell />
            <span>Reminders</span>
          </button>

          <button
            className="dashboard-nav-button active"
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

      {/* MAIN CONTENT */}
      <main className="dashboard-content risk-content">

        {/* PAGE HEADING */}
        <div className="page-heading">
          <div>
            <h2>Dropout-Risk Monitoring</h2>

            <p className="section-description">
              Identify students who may need additional support and follow-up.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <FiRefreshCw />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

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

        {loading ? (
          <p className="page-message">
            Loading risk assessments...
          </p>
        ) : (
          <>

            {/* RISK SUMMARY */}
            <section className="risk-summary">

              <div className="risk-summary-card">
                <div className="risk-summary-icon high-icon">
                  <FiAlertTriangle />
                </div>

                <div>
                  <p>High Risk</p>
                  <h3>{highRiskCount}</h3>
                </div>
              </div>

              <div className="risk-summary-card">
                <div className="risk-summary-icon medium-icon">
                  <FiClock />
                </div>

                <div>
                  <p>Medium Risk</p>
                  <h3>{mediumRiskCount}</h3>
                </div>
              </div>

              <div className="risk-summary-card">
                <div className="risk-summary-icon low-icon">
                  <FiShield />
                </div>

                <div>
                  <p>Low Risk</p>
                  <h3>{lowRiskCount}</h3>
                </div>
              </div>

              <div className="risk-summary-card">
                <div className="risk-summary-icon task-icon">
                  <FiCheckCircle />
                </div>

                <div>
                  <p>Open Tasks</p>
                  <h3>{openTasksCount}</h3>
                </div>
              </div>

            </section>

            {/* ASSESS STUDENTS */}
            <section className="table-card risk-table-card">

              <div className="risk-section-heading">
                <div>
                  <h3>Assess Students</h3>

                  <p className="section-description">
                    Run a risk assessment for an individual student.
                  </p>
                </div>
              </div>

              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Attendance</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.student_id}</td>

                        <td>{student.name}</td>

                        <td>
                          {student.attendance_percentage}%
                        </td>

                        <td>
                          <button
                            className="small-button"
                            disabled={processingId === student.id}
                            onClick={() => assessStudent(student.id)}
                          >
                            {processingId === student.id
                              ? "Assessing..."
                              : "Assess Risk"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {students.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </section>

            {/* ASSESSMENT RESULTS */}
            <section className="table-card risk-table-card">

              <div className="risk-section-heading">
                <div>
                  <h3>Risk Assessment Results</h3>

                  <p className="section-description">
                    Latest assessment for each student.
                  </p>
                </div>

                <span className="risk-total-count">
                  {latestAssessments.length} students assessed
                </span>
              </div>

              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Risk Score</th>
                      <th>Risk Level</th>
                      <th>Reasons</th>
                      <th>False Positive</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestAssessments.map((assessment) => {
                      const reasons = getReasons(
                        assessment.reasons
                      );

                      const score = Math.min(
                        100,
                        Math.max(0, Number(assessment.score) || 0)
                      );

                      return (
                        <tr key={assessment.id}>

                          <td>
                            {assessment.student_name ||
                              assessment.student}
                          </td>

                          <td>
                            <div className="risk-score-cell">
                              <strong>{score}/100</strong>

                              <div className="risk-progress">
                                <div
                                  className={`risk-progress-fill risk-fill-${assessment.level?.toLowerCase()}`}
                                  style={{
                                    width: `${score}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`risk-pill risk-${assessment.level?.toLowerCase()}`}
                            >
                              {assessment.level}
                            </span>
                          </td>

                          <td>
                            {reasons.length > 0 ? (
                              <ul className="risk-reasons-list">
                                {reasons.map((reason, index) => (
                                  <li key={index}>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="no-risk-reasons">
                                No risk factors detected
                              </span>
                            )}
                          </td>

                          <td>
                            {assessment.is_false_positive ? (
                              <span className="false-positive-yes">
                                Yes
                              </span>
                            ) : (
                              <span className="false-positive-no">
                                No
                              </span>
                            )}
                          </td>

                          <td>
                            {!assessment.is_false_positive ? (
                              <button
                                className="small-button"
                                disabled={
                                  processingId === assessment.id
                                }
                                onClick={() =>
                                  markFalsePositive(assessment.id)
                                }
                              >
                                {processingId === assessment.id
                                  ? "Updating..."
                                  : "Mark False Positive"}
                              </button>
                            ) : (
                              <span className="completed-label">
                                Marked
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    })}

                    {latestAssessments.length === 0 && (
                      <tr>
                        <td colSpan="6">
                          No assessments yet. Select a student and click
                          Assess Risk to begin.
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>

            </section>

            {/* COUNSELLOR TASKS */}
            <section className="table-card risk-table-card">

              <div className="risk-section-heading">
                <div>
                  <h3>Counsellor Call Tasks</h3>

                  <p className="section-description">
                    Follow up with students identified as high risk.
                  </p>
                </div>

                <span className="risk-total-count">
                  {openTasksCount} open tasks
                </span>
              </div>

              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Task Description</th>
                      <th>Created</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>

                        <td>
                          {task.student_name || task.student}
                        </td>

                        <td>{task.description}</td>

                        <td>
                          {task.created_at
                            ? new Date(
                                task.created_at
                              ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={
                              task.completed
                                ? "task-status completed"
                                : "task-status open"
                            }
                          >
                            {task.completed
                              ? "Completed"
                              : "Open"}
                          </span>
                        </td>

                        <td>
                          {!task.completed && (
                            <button
                              className="small-button"
                              disabled={processingId === task.id}
                              onClick={() => completeTask(task.id)}
                            >
                              {processingId === task.id
                                ? "Updating..."
                                : "Complete Task"}
                            </button>
                          )}

                          {task.completed && (
                            <span className="completed-label">
                              Done
                            </span>
                          )}
                        </td>

                      </tr>
                    ))}

                    {tasks.length === 0 && (
                      <tr>
                        <td colSpan="5">
                          No counsellor tasks available.
                          Tasks are automatically created for high-risk students.
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>

            </section>

            <p className="risk-demo-note">
              Risk scores are generated using predefined rules based on
              attendance, test performance and fee payment history.
              They are indicators for counsellor follow-up, not definitive
              predictions of student dropout.
            </p>

          </>
        )}

      </main>
    </div>
  );
}

export default RiskAssessment;