
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FiUsers,
  FiCreditCard,
  FiTrendingUp,
  FiDollarSign,
  FiAlertCircle,
  FiClipboard,
  FiLogOut,
  FiBookOpen,
  FiRefreshCw,
  FiBell,
  FiActivity,
  FiBriefcase,
} from "react-icons/fi";

import api from "../api/axios";


const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));


/* =====================================
   STAT CARD
===================================== */

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-top">
        <div className="stat-card-info">
          <p className="stat-title">{title}</p>
          <h2>{value}</h2>
        </div>

        <div className="stat-icon">
          <Icon />
        </div>
      </div>

      <div className="stat-card-bottom">
        <span className="stat-indicator">
          <FiActivity />
        </span>

        <p className="stat-description">{description}</p>
      </div>
    </div>
  );
}


/* =====================================
   DASHBOARD
===================================== */

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard/");
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load dashboard. Please check your login and backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) {
    return <p className="page-message">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="page-message error">{error}</p>;
  }

  if (!data) {
    return <p className="page-message">No dashboard data available.</p>;
  }

  const summary = data.summary || {};
  const ageing = data.ageing || {};

  const centreData = data.centre_wise || [];
  const batchData = data.batch_wise || [];

  const ageingData = [
    { name: "0–30 days", amount: Number(ageing["0_30_days"] || 0) },
    { name: "31–60 days", amount: Number(ageing["31_60_days"] || 0) },
    { name: "61–90 days", amount: Number(ageing["61_90_days"] || 0) },
    { name: "90+ days", amount: Number(ageing["90_plus_days"] || 0) },
  ];

  const collectionData = [
    { name: "Collected", value: Number(summary.total_collected || 0) },
    { name: "Outstanding", value: Number(summary.total_outstanding || 0) },
  ];

  /* =====================================
     NAVIGATION ITEMS
  ===================================== */

  const navigationItems = [
    { label: "Students", icon: FiUsers, path: "/students" },
    { label: "Accounts Management", icon: FiBriefcase, path: "/management" },
    { label: "Refunds", icon: FiRefreshCw, path: "/refunds" },
    { label: "Reminders", icon: FiBell, path: "/reminders" },
    { label: "Risk Monitoring", icon: FiActivity, path: "/risk" },
  ];

  return (
    <div className="dashboard-page">

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
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                className="dashboard-nav-button"
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

      <main className="dashboard-content">

        {/* WELCOME SECTION */}

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              <FiActivity /> OVERVIEW
            </span>

            <h2>Welcome to EduLedger</h2>

            <p className="section-description">
              Monitor fee collection and outstanding dues across your centres.
            </p>
          </div>

          <button
            className="manage-students-button"
            onClick={() => navigate("/students")}
          >
            <FiUsers />
            Manage Students
          </button>
        </section>


        {/* STATISTICS */}

        <section className="stats-grid">

          <StatCard
            title="Active Students"
            value={summary.total_students ?? 0}
            description="Currently enrolled students"
            icon={FiUsers}
            color="blue"
          />

          <StatCard
            title="Total Billed"
            value={formatCurrency(summary.total_billed)}
            description="Total scheduled fees"
            icon={FiCreditCard}
            color="purple"
          />

          <StatCard
            title="Fees Collected"
            value={formatCurrency(summary.total_collected)}
            description="Successfully received payments"
            icon={FiTrendingUp}
            color="green"
          />

          <StatCard
            title="Outstanding Dues"
            value={formatCurrency(summary.total_outstanding)}
            description="Remaining amount to collect"
            icon={FiDollarSign}
            color="orange"
          />

          <StatCard
            title="Overdue Fees"
            value={formatCurrency(summary.overdue_amount)}
            description="Fees past their due date"
            icon={FiAlertCircle}
            color="red"
          />

          <StatCard
            title="Open Counsellor Tasks"
            value={summary.pending_counsellor_tasks ?? 0}
            description="Pending student follow-ups"
            icon={FiClipboard}
            color="indigo"
          />

        </section>


        {/* CHARTS */}

        <section className="charts-grid">

          {/* FEE COLLECTION STATUS */}

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h3>Fee Collection Status</h3>
                <p>Collected versus outstanding fees</p>
              </div>

              <span className="chart-heading-icon">
                <FiCreditCard />
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={collectionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={58}
                  paddingAngle={4}
                  label
                >
                  {collectionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index === 0 ? "#2563eb" : "#f59e0b"}
                      stroke="white"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>


          {/* OVERDUE AGEING */}

          <div className="chart-card">
            <div className="chart-heading">
              <div>
                <h3>Overdue Ageing</h3>
                <p>Outstanding fees by ageing period</p>
              </div>

              <span className="chart-heading-icon">
                <FiAlertCircle />
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={ageingData}
                margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e8edf5"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  cursor={{ fill: "#eff6ff" }}
                />

                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                  radius={[7, 7, 0, 0]}
                  barSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>


        {/* CENTRE-WISE COLLECTION */}

        <section className="table-card">

          <div className="table-heading">
            <div>
              <h3>Centre-wise Collection</h3>
              <p>Fee collection breakdown by centre</p>
            </div>
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Centre</th>
                  <th>Collected</th>
                  <th>Outstanding</th>
                </tr>
              </thead>

              <tbody>
                {centreData.length > 0 ? (
                  centreData.map((centre, index) => (
                    <tr key={centre.centre_id || index}>
                      <td>{centre.centre}</td>

                      <td className="amount-collected">
                        {formatCurrency(centre.collected)}
                      </td>

                      <td className="amount-outstanding">
                        {formatCurrency(centre.outstanding)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No centre data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>


        {/* BATCH-WISE COLLECTION */}

        <section className="table-card">

          <div className="table-heading">
            <div>
              <h3>Batch-wise Collection</h3>
              <p>Fee collection breakdown by batch</p>
            </div>
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Collected</th>
                  <th>Outstanding</th>
                </tr>
              </thead>

              <tbody>
                {batchData.length > 0 ? (
                  batchData.map((batch, index) => (
                    <tr key={batch.batch_id || index}>
                      <td>{batch.batch}</td>

                      <td className="amount-collected">
                        {formatCurrency(batch.collected)}
                      </td>

                      <td className="amount-outstanding">
                        {formatCurrency(batch.outstanding)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No batch data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
