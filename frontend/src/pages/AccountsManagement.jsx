
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiBookOpen,
  FiUsers,
  FiRefreshCw,
  FiBell,
  FiActivity,
  FiLogOut,
  FiBriefcase,
} from "react-icons/fi";

import api from "../api/axios";

export default function AccountsManagement() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("parents");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [parents, setParents] = useState([]);
  const [centres, setCentres] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [parentForm, setParentForm] = useState({
    username: "",
    password: "",
    phone: "",
    preferred_language: "EN",
  });

  const [centreForm, setCentreForm] = useState({
    name: "",
    location: "",
  });

  const [batchForm, setBatchForm] = useState({
    name: "",
    centre: "",
  });

  const [studentForm, setStudentForm] = useState({
    student_id: "",
    name: "",
    parent: "",
    batch: "",
    attendance_percentage: "100",
    active: true,
  });

  /* =====================================
     NAVIGATION
  ===================================== */

  const navigationItems = [
    { label: "Students", icon: FiUsers, path: "/students" },
    {
      label: "Accounts Management",
      icon: FiBriefcase,
      path: "/management",
    },
    { label: "Refunds", icon: FiRefreshCw, path: "/refunds" },
    { label: "Reminders", icon: FiBell, path: "/reminders" },
    { label: "Risk Monitoring", icon: FiActivity, path: "/risk" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  /* =====================================
     LOAD DATA
  ===================================== */

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        parentsResponse,
        centresResponse,
        batchesResponse,
        studentsResponse,
      ] = await Promise.all([
        api.get("/auth/parents/"),
        api.get("/students/centres/"),
        api.get("/students/batches/"),
        api.get("/students/"),
      ]);

      setParents(parentsResponse.data);
      setCentres(centresResponse.data);
      setBatches(batchesResponse.data);
      setStudents(studentsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load management data. Please check your login and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");
  };

  /* =====================================
     CREATE PARENT
  ===================================== */

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/parents/", parentForm);

      setParentForm({
        username: "",
        password: "",
        phone: "",
        preferred_language: "EN",
      });

      showSuccess("Parent account created successfully.");
      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data || "Unable to create parent.")
      );
    }
  };

  /* =====================================
     CREATE CENTRE
  ===================================== */

  const handleCentreSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/students/centres/", centreForm);

      setCentreForm({
        name: "",
        location: "",
      });

      showSuccess("Centre created successfully.");
      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data || "Unable to create centre.")
      );
    }
  };

  /* =====================================
     CREATE BATCH
  ===================================== */

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/students/batches/", {
        name: batchForm.name,
        centre: Number(batchForm.centre),
      });

      setBatchForm({
        name: "",
        centre: "",
      });

      showSuccess("Batch created successfully.");
      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data || "Unable to create batch.")
      );
    }
  };

  /* =====================================
     CREATE STUDENT
  ===================================== */

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/students/", {
        ...studentForm,
        parent: Number(studentForm.parent),
        batch: Number(studentForm.batch),
        attendance_percentage: Number(
          studentForm.attendance_percentage
        ),
      });

      setStudentForm({
        student_id: "",
        name: "",
        parent: "",
        batch: "",
        attendance_percentage: "100",
        active: true,
      });

      showSuccess("Student created and assigned successfully.");
      await loadData();
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data || "Unable to create student.")
      );
    }
  };

  /* =====================================
     PAGE
  ===================================== */

  return (
    <div className="dashboard-page management-page">

      {/* HEADER */}

      <header className="dashboard-header">
        <div
          className="dashboard-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="dashboard-brand-icon">
            <FiBookOpen />
          </div>

          <div>
            <h1>EduLedger</h1>
            <p>Accounts Executive Portal</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                className={`dashboard-nav-button ${
                  item.path === "/management" ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}

      <main className="dashboard-content management-content">

        {/* PAGE HEADING */}

        <section className="management-header">
          <div>
            <span className="management-eyebrow">
              ADMINISTRATION
            </span>

            <h2>Accounts Management</h2>

            <p className="section-description">
              Manage parent accounts, centres, batches and student assignments.
            </p>
          </div>

          <button
            className="management-refresh"
            onClick={loadData}
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </section>

        {/* STATISTICS */}

        <section className="management-stats">

          <div className="management-stat">
            <div className="management-stat-icon parents-icon">
              <FiUsers />
            </div>
            <div>
              <span>Total Parents</span>
              <strong>{parents.length}</strong>
            </div>
          </div>

          <div className="management-stat">
            <div className="management-stat-icon centres-icon">
              <FiBriefcase />
            </div>
            <div>
              <span>Total Centres</span>
              <strong>{centres.length}</strong>
            </div>
          </div>

          <div className="management-stat">
            <div className="management-stat-icon batches-icon">
              <FiBookOpen />
            </div>
            <div>
              <span>Total Batches</span>
              <strong>{batches.length}</strong>
            </div>
          </div>

          <div className="management-stat">
            <div className="management-stat-icon students-icon">
              <FiUsers />
            </div>
            <div>
              <span>Total Students</span>
              <strong>{students.length}</strong>
            </div>
          </div>

        </section>

        {/* TABS */}

        <section className="management-tabs-section">
          <div className="management-tabs-heading">
            <div>
              <h3>Management Sections</h3>
              <p>Select what you want to manage.</p>
            </div>
          </div>

          <div className="management-tabs">
            {[
              ["parents", "Parents"],
              ["centres", "Centres"],
              ["batches", "Batches"],
              ["students", "Students"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={activeTab === key ? "active" : ""}
                onClick={() => {
                  setActiveTab(key);
                  setError("");
                  setSuccess("");
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* MESSAGES */}

        {error && (
          <div className="management-error">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="management-success">
            {success}
          </div>
        )}

        {loading && (
          <p className="management-loading">
            Loading management data...
          </p>
        )}

        {/* TAB CONTENT */}

        {!loading && (
          <div className="management-content-grid">

            {/* PARENTS */}

            {activeTab === "parents" && (
              <>
                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Create Parent Account</h3>
                      <p>Add login credentials and contact details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleParentSubmit}>
                    <div className="management-form-field">
                      <label>Username</label>
                      <input
                        required
                        value={parentForm.username}
                        onChange={(e) =>
                          setParentForm({
                            ...parentForm,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter parent username"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Password</label>
                      <input
                        required
                        type="password"
                        minLength="8"
                        value={parentForm.password}
                        onChange={(e) =>
                          setParentForm({
                            ...parentForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Minimum 8 characters"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Phone Number</label>
                      <input
                        value={parentForm.phone}
                        onChange={(e) =>
                          setParentForm({
                            ...parentForm,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Preferred Language</label>
                      <select
                        value={parentForm.preferred_language}
                        onChange={(e) =>
                          setParentForm({
                            ...parentForm,
                            preferred_language: e.target.value,
                          })
                        }
                      >
                        <option value="EN">English</option>
                        <option value="HI">Hindi</option>
                      </select>
                    </div>

                    <button type="submit" className="management-submit">
                      Create Parent
                    </button>
                  </form>
                </section>

                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Registered Parents</h3>
                      <p>Parent accounts currently registered.</p>
                    </div>

                    <span className="management-count">
                      {parents.length} Records
                    </span>
                  </div>

                  {parents.length === 0 ? (
                    <p className="management-empty">
                      No parent accounts found.
                    </p>
                  ) : (
                    <div className="management-table-wrapper">
                      <table className="management-table">
                        <thead>
                          <tr>
                            <th>Username</th>
                            <th>Phone</th>
                            <th>Language</th>
                          </tr>
                        </thead>

                        <tbody>
                          {parents.map((parent) => (
                            <tr key={parent.id}>
                              <td className="management-primary-cell">
                                {parent.username}
                              </td>
                              <td>{parent.phone || "—"}</td>
                              <td>
                                {parent.preferred_language === "HI"
                                  ? "Hindi"
                                  : "English"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* CENTRES */}

            {activeTab === "centres" && (
              <>
                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Add New Centre</h3>
                      <p>Register a new education centre.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCentreSubmit}>
                    <div className="management-form-field">
                      <label>Centre Name</label>
                      <input
                        required
                        value={centreForm.name}
                        onChange={(e) =>
                          setCentreForm({
                            ...centreForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Example: Jaipur Main Centre"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Location</label>
                      <input
                        required
                        value={centreForm.location}
                        onChange={(e) =>
                          setCentreForm({
                            ...centreForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="Enter centre location"
                      />
                    </div>

                    <button type="submit" className="management-submit">
                      Add Centre
                    </button>
                  </form>
                </section>

                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>All Centres</h3>
                      <p>Registered education centres.</p>
                    </div>

                    <span className="management-count">
                      {centres.length} Records
                    </span>
                  </div>

                  {centres.length === 0 ? (
                    <p className="management-empty">
                      No centres found.
                    </p>
                  ) : (
                    <div className="management-table-wrapper">
                      <table className="management-table">
                        <thead>
                          <tr>
                            <th>Centre Name</th>
                            <th>Location</th>
                          </tr>
                        </thead>

                        <tbody>
                          {centres.map((centre) => (
                            <tr key={centre.id}>
                              <td className="management-primary-cell">
                                {centre.name}
                              </td>
                              <td>{centre.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* BATCHES */}

            {activeTab === "batches" && (
              <>
                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Create Batch</h3>
                      <p>Create a batch and assign it to a centre.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBatchSubmit}>
                    <div className="management-form-field">
                      <label>Batch Name</label>
                      <input
                        required
                        value={batchForm.name}
                        onChange={(e) =>
                          setBatchForm({
                            ...batchForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Example: JEE 2027 Morning"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Assign Centre</label>
                      <select
                        required
                        value={batchForm.centre}
                        onChange={(e) =>
                          setBatchForm({
                            ...batchForm,
                            centre: e.target.value,
                          })
                        }
                      >
                        <option value="">Select centre</option>

                        {centres.map((centre) => (
                          <option key={centre.id} value={centre.id}>
                            {centre.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="management-submit"
                      disabled={centres.length === 0}
                    >
                      Create Batch
                    </button>

                    {centres.length === 0 && (
                      <p className="management-hint">
                        Create a centre before creating a batch.
                      </p>
                    )}
                  </form>
                </section>

                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>All Batches</h3>
                      <p>View batches and their assigned centres.</p>
                    </div>

                    <span className="management-count">
                      {batches.length} Records
                    </span>
                  </div>

                  {batches.length === 0 ? (
                    <p className="management-empty">
                      No batches found.
                    </p>
                  ) : (
                    <div className="management-table-wrapper">
                      <table className="management-table">
                        <thead>
                          <tr>
                            <th>Batch Name</th>
                            <th>Centre</th>
                          </tr>
                        </thead>

                        <tbody>
                          {batches.map((batch) => (
                            <tr key={batch.id}>
                              <td className="management-primary-cell">
                                {batch.name}
                              </td>
                              <td>{batch.centre_name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

            {/* STUDENTS */}

            {activeTab === "students" && (
              <>
                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Add Student</h3>
                      <p>Create a student and assign a parent and batch.</p>
                    </div>
                  </div>

                  <form onSubmit={handleStudentSubmit}>
                    <div className="management-form-field">
                      <label>Student ID</label>
                      <input
                        required
                        value={studentForm.student_id}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            student_id: e.target.value,
                          })
                        }
                        placeholder="Example: STU001"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Student Name</label>
                      <input
                        required
                        value={studentForm.name}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter student name"
                      />
                    </div>

                    <div className="management-form-field">
                      <label>Assign Parent</label>
                      <select
                        required
                        value={studentForm.parent}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            parent: e.target.value,
                          })
                        }
                      >
                        <option value="">Select parent</option>

                        {parents.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="management-form-field">
                      <label>Assign Batch</label>
                      <select
                        required
                        value={studentForm.batch}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            batch: e.target.value,
                          })
                        }
                      >
                        <option value="">Select batch</option>

                        {batches.map((batch) => (
                          <option key={batch.id} value={batch.id}>
                            {batch.name} — {batch.centre_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="management-form-field">
                      <label>Attendance Percentage</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                        value={studentForm.attendance_percentage}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            attendance_percentage: e.target.value,
                          })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className="management-submit"
                      disabled={parents.length === 0 || batches.length === 0}
                    >
                      Add Student
                    </button>

                    {(parents.length === 0 || batches.length === 0) && (
                      <p className="management-hint">
                        Create at least one parent and one batch before
                        adding a student.
                      </p>
                    )}
                  </form>
                </section>

                <section className="management-panel">
                  <div className="management-panel-heading">
                    <div>
                      <h3>Registered Students</h3>
                      <p>Students registered in the system.</p>
                    </div>

                    <span className="management-count">
                      {students.length} Records
                    </span>
                  </div>

                  {students.length === 0 ? (
                    <p className="management-empty">
                      No students found.
                    </p>
                  ) : (
                    <div className="management-table-wrapper">
                      <table className="management-table">
                        <thead>
                          <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Parent</th>
                            <th>Batch</th>
                            <th>Attendance</th>
                          </tr>
                        </thead>

                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td>{student.student_id}</td>
                              <td className="management-primary-cell">
                                {student.name}
                              </td>
                              <td>
                                {student.parent_name || student.parent}
                              </td>
                              <td>
                                {student.batch_name || student.batch}
                              </td>
                              <td>
                                {student.attendance_percentage}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
