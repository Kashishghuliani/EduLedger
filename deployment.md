# EduLedger – Deployment and Setup Guide

## 1. Introduction

EduLedger is a web-based fee management and student monitoring system developed for coaching institutes. It provides a centralized platform for managing students, parents, centres, batches, fee plans, installment payments, reminders, refunds and student dropout-risk monitoring.

The application has two main user roles:

1. **Accounts Executive:** Manages the institute's administrative and financial operations.
2. **Parent:** Accesses the parent portal to view linked student information, check fee dues, track installments, view reminders and make simulated payments.

This document explains how to configure, install, run and test EduLedger locally.

---

## 2. Project Architecture

EduLedger follows a frontend-backend architecture in which the frontend communicates with the backend through REST APIs.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | User interface and interactions |
| Backend | Python, Django | Application logic and business operations |
| API Layer | Django REST Framework | Communication between frontend and backend |
| Database | PostgreSQL | Persistent storage of application data |
| Authentication | JWT | Secure login and API authentication |

### How the application works

1. A user opens the React frontend in a browser.
2. The user enters login credentials.
3. The frontend sends the credentials to the Django authentication API.
4. Django validates the credentials and returns JWT tokens.
5. The frontend uses the access token when calling protected APIs.
6. Django checks authentication and role-based permissions.
7. The backend reads or updates the PostgreSQL database.
8. The API returns the requested information to the frontend.
9. React displays the updated information to the user.

The frontend and backend run independently during local development, communicating over HTTP.

---

## 3. System Requirements

Install the following software before setting up the project.

| Software | Purpose |
|---|---|
| Python 3 | Runs the Django backend |
| pip | Installs Python dependencies |
| Node.js | Runs the React development environment |
| npm | Installs frontend dependencies |
| PostgreSQL | Stores application data |
| Git | Clones and manages the repository |

You can verify the installations using:

```bash
python --version
pip --version
node --version
npm --version
git --version
```

Make sure PostgreSQL is installed and its database service is running.

---

## 4. Clone the GitHub Repository

Open a terminal or command prompt.

Run:

```bash
git clone https://github.com/Kashishghuliani/EduLedger
```

Navigate into the project directory:

```bash
cd EduLedger
```

The project contains two main application directories:

```text
EduLedger/
│
├── backend/
│   ├── config/
│   ├── accounts/
│   ├── students/
│   ├── fees/
│   ├── payments/
│   ├── reminders/
│   ├── refunds/
│   ├── risk/
│   ├── dashboard/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── deployment.md
```

The backend contains the Django applications and API logic, while the frontend contains the React application and user interface.

---

# 5. Backend Setup

The backend handles authentication, database operations, fee calculations, payment processing, reminder generation, refunds and risk assessments.

### Step 1: Open the backend directory

```bash
cd backend
```

All backend commands in this section should be executed from this directory.

### Step 2: Create a Python virtual environment

A virtual environment keeps the project's Python dependencies separate from other Python projects on your computer.

Create it using:

```bash
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

After activation, your terminal should display the virtual environment name.

For macOS or Linux:

```bash
source venv/bin/activate
```

### Step 3: Install backend dependencies

The `requirements.txt` file contains the Python packages required by the backend, along with their versions.

Run:

```bash
pip install -r requirements.txt
```

This installs the Django framework, Django REST Framework, database drivers, authentication packages and other dependencies listed in the file.

### Step 4: Configure environment variables

The backend uses environment variables to store application configuration and database connection details.

Create a file named `.env` inside the `backend` directory.

Add the configuration variables expected by your Django settings.

The required configuration categories include:

| Configuration | Description |
|---|---|
| Secret Key | Used by Django for cryptographic signing and security |
| Debug | Controls whether Django runs in debug mode |
| Allowed Hosts | Defines the hosts permitted to serve the application |
| Database Name | Name of the PostgreSQL database |
| Database User | PostgreSQL username |
| Database Password | Password for the PostgreSQL user |
| Database Host | Address of the PostgreSQL server |
| Database Port | Port used by PostgreSQL |

**Important:** Use the exact variable names expected by `backend/config/settings.py`. Do not commit the actual `.env` file or expose secret values in the public repository.


### Step 5: Create the PostgreSQL database

EduLedger uses PostgreSQL to persist application information.

Open PostgreSQL using pgAdmin or the PostgreSQL command-line interface.

Create the database:

```sql
CREATE DATABASE eduledger;
```

The database name, username, password, host and port configured in `.env` must match your PostgreSQL setup.

Once created, Django will use this database to store users, students, centres, batches, fee records, payments, reminders, refunds and risk assessments.

### Step 6: Apply database migrations

Django migrations create the database tables corresponding to the application's models.

Run:

```bash
python manage.py migrate
```

This applies all existing migrations across the Django applications.

If migrations have not yet been generated for newly created models, generate them first:

```bash
python manage.py makemigrations
python manage.py migrate
```

For a normal fresh installation from the submitted repository, the existing migration files should already be included.

### Step 7: Create demo accounts

EduLedger provides demo accounts so that reviewers can explore both user roles without manually registering accounts.

Run:

```bash
python manage.py create_demo_accounts
```

This management command creates or updates the demo Accounts Executive and Parent accounts.

The command also sets their demo passwords. Running it again may reset those passwords to the configured demo values.

**Note:** Demo accounts are for evaluation purposes only. Do not use these credentials for a production deployment.

### Step 8: Start the Django backend

Run:

```bash
python manage.py runserver
```

The Django development server will start at:

```text
http://127.0.0.1:8000/
```

Keep this terminal running while using the frontend.

The backend provides the REST APIs used by the React application.

---

# 6. Frontend Setup

The frontend is developed using React. It provides separate interfaces for Accounts Executives and Parents.

### Step 1: Open a new terminal

Keep the backend terminal running.

Open another terminal and navigate to the project directory.

Then enter the frontend directory:

```bash
cd EduLedger/frontend
```

### Step 2: Install frontend dependencies

The `package.json` file defines the frontend dependencies and available scripts.

Run:

```bash
npm install
```

This installs the required JavaScript packages, including the dependencies used by the React application, API communication, routing and icons.

The `package-lock.json` file helps maintain consistent dependency versions.

### Step 3: Configure the API base URL

The React frontend communicates with the Django backend through Axios.

For local development, the backend API base URL should point to:

```text
http://127.0.0.1:8000/api/
```

Check the Axios configuration file and make sure it uses the correct backend URL.


### Step 4: Start the React application

Run:

```bash
npm run dev
```

The frontend development server will generally be available at:

```text
http://localhost:5173/
```

Open this address in a browser to access EduLedger.

**Important:** Both the backend and frontend servers must be running simultaneously for the application to work correctly.

---

# 7. Demo Login Credentials

The application includes two demo accounts for reviewing the different access levels.

| Account Type | Username | Password |
|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` |
| Parent | `parent_aarav` | `Parent@123` |

## 7.1 Accounts Executive Account

The Accounts Executive has access to the administrative features of EduLedger.

After logging in, the reviewer can explore:

**Dashboard**
- View overall fee collection information.
- View outstanding fee amounts.
- Review fee ageing information.
- View centre and batch-level summaries.
- Monitor open counsellor tasks.

**Account Management**
- Create and manage parent accounts.
- Add students and associate them with parents.
- Create and manage coaching centres.
- Create batches under individual centres.

**Fee Management**
- Create student fee plans.
- Configure installment amounts and due dates.
- View student fee ledgers.
- Track pending, partial and paid installments.

**Payments**
- Simulate successful and failed payments.
- Record successful payment transactions.
- Generate payment receipts.
- Update installment balances.
- Stop pending reminders when an installment is fully paid.

**Reminders**
- Generate fee reminder records.
- View reminder status and message language.
- Generate reminders for upcoming, due and overdue installments according to the configured rules.

**Refund Management**
- Calculate refunds based on the implemented pro-rata approach.
- View refund records and processing deadlines.

**Risk Monitoring**
- Assess students using predefined risk rules.
- View risk levels and assessment reasons.
- Create counsellor call tasks for high-risk students.
- Mark incorrect assessments as false positives.

## 7.2 Parent Account

The Parent account provides access to the parent portal.

After logging in, the reviewer can:

- View linked student information.
- Check total course fees.
- View the amount already paid.
- Check the outstanding fee balance.
- View installment due dates and payment statuses.
- Make simulated payments.
- View fee reminder information.

Parents can only access student information linked to their own account.

---

# 8. Application Workflows

This section explains the main workflows implemented in EduLedger.

## 8.1 Account Management Workflow

The Accounts Executive manages the institute's basic records.

The relationship between the main entities is:

```text
Centre
  |
  └── Batch
        |
        └── Student
              |
              └── Parent
```

A centre can contain multiple batches, and each batch can contain multiple students.

Each student is associated with a parent account. A parent can be linked to multiple students.

The Accounts Executive creates parent accounts, centres, batches and student records through the Account Management section.

## 8.2 Fee Management Workflow

1. The Accounts Executive selects a student.
2. A fee plan is created with the total fee and applicable discount.
3. The payable amount is calculated.
4. The payable amount is divided into installments.
5. Each installment receives an amount and due date.
6. The system tracks payments against each installment.
7. The outstanding amount is updated as payments are recorded.

## 8.3 Payment Workflow

EduLedger uses a simulated payment flow for demonstration.

1. The Parent opens the fee ledger.
2. The Parent selects an eligible installment.
3. The application sends a payment request to the backend.
4. The backend processes the simulated success or failure result.
5. For successful payments, the payment record and receipt are created.
6. The paid amount and installment status are updated.
7. When an installment is fully paid, its pending reminders are marked as skipped.

No actual money is transferred because a real payment gateway is not integrated.

## 8.4 Reminder Workflow

The reminder system identifies installments based on their due dates.

The configured reminder rules generate reminders for:

- Three days before the due date.
- The due date itself.
- Three days after the due date.

The generated reminder contains the installment information, message, preferred language and reminder status.

Reminder records are stored in PostgreSQL.

Actual SMS and WhatsApp delivery are not configured in this implementation.

## 8.5 Refund Workflow

The Accounts Executive selects a student and provides the relevant course dates and withdrawal date.

The backend calculates the refund using the implemented pro-rata calendar-day approach.

The refund record includes:

- Student information.
- Course start date.
- Course end date.
- Withdrawal date.
- Amount paid.
- Calculated refund amount.
- Processing deadline.
- Refund status.

The processing deadline is calculated as ten days after the withdrawal date.

This formula is an implementation assumption and should not be treated as an institute-confirmed refund policy.

## 8.6 Student Risk Assessment Workflow

The risk monitoring module evaluates student information using predefined conditions.

The current scoring rules are:

| Condition | Risk Score |
|---|---:|
| Installment overdue by more than 30 days | +35 |
| Attendance below 60% | +30 |
| Declining performance across the last three test scores | +25 |
| Two or more overdue installments | +10 |

The total score determines the risk level:

| Score | Risk Level |
|---|---|
| Below 30 | Low |
| 30–59 | Medium |
| 60 or above | High |

When a student receives a high-risk assessment, the system creates a counsellor call task.

If an assessment is incorrect, the Accounts Executive can mark it as a false positive.

**Important:** This is a rules-based risk assessment system. It does not use a trained machine-learning model.

---

# 9. Environment Variables and Configuration

The application uses environment variables to separate configuration from source code.

Before running the application, configure the required variables in the appropriate backend and frontend environment files.

The exact names must match the variables read by the project's settings and API configuration.

| Variable category | Used by | Purpose |
|---|---|---|
| Django secret key | Backend | Application security |
| Debug setting | Backend | Development or production mode |
| Allowed hosts | Backend | Host validation |
| Database name | Backend | PostgreSQL database selection |
| Database username | Backend | Database authentication |
| Database password | Backend | Database authentication |
| Database host | Backend | Database server connection |
| Database port | Backend | Database connection port |
| API base URL, if configured through an environment variable | Frontend | Backend API address |

Never place actual secret values in GitHub, the TDD or this deployment document.

---

# 10. Important Implementation Limitations

The following limitations should be considered when reviewing the application:

1. **Mock Payments:** Payments are simulated. No real payment gateway or financial transaction is involved.

2. **Reminder Delivery:** Reminders are generated and stored in the database. External SMS and WhatsApp delivery services are not integrated.

3. **Risk Assessment:** Risk levels are calculated using predefined rules and thresholds rather than a trained machine-learning model.

4. **Refund Calculation:** The refund amount follows an assumed pro-rata calendar-day calculation. The formula is not based on a confirmed institute-specific refund policy.

5. **Development Servers:** The commands in this guide use local development servers. They are intended for local evaluation, not production hosting.

---

# 11. Troubleshooting

| Problem | Possible cause | Solution |
|---|---|---|
| Backend does not start | Missing dependencies or configuration | Activate the virtual environment, install requirements and check `.env`. |
| Database connection fails | PostgreSQL is stopped or credentials are incorrect | Start PostgreSQL and verify the database configuration. |
| Migration error | Database or migration configuration issue | Check the database connection and existing migration files. |
| Frontend packages are missing | Dependencies have not been installed | Run `npm install` inside the frontend directory. |
| Frontend cannot reach backend | Backend is not running or API URL is incorrect | Start Django and verify the Axios base URL. |
| Login fails | Demo account does not exist or credentials are incorrect | Run the demo-account management command again. |
| Parent cannot see student records | Student is not linked to the logged-in parent | Verify the student's parent relationship in the database. |

---

# 12. Local Application URLs

After starting both development servers, use the following URLs:

| Component | URL |
|---|---|
| React Frontend | http://localhost:5173/ |
| Django Backend | http://127.0.0.1:8000/ |
| Django Admin | http://127.0.0.1:8000/admin/ |

The Django Admin interface can be used for database-level inspection by an authorized superuser, if one has been configured.

---

# 13. Final Notes

- Run the backend and frontend in separate terminals.
- Ensure PostgreSQL is running before starting Django.
- Keep the `.env` file private.
- Use the provided demo accounts to explore the application.
- Use only sample or dummy information during evaluation.
- The application is configured for local development using the instructions in this document.

**Repository:** https://github.com/Kashishghuliani/EduLedger

**End of Deployment Guide**
