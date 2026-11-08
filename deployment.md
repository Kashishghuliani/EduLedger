# EduLedger – Deployment and Setup Guide

**Project:** EduLedger – Smart Fee Management System  
**GitHub Repository:** https://github.com/Kashishghuliani/EduLedger  
**Live Application:** https://edu-ledger-nine.vercel.app/

---

# 1. Introduction

EduLedger is a web-based fee management and student monitoring system developed for coaching institutes.

It provides a centralized platform for managing students, parents, centres, batches, fee plans, installment payments, receipts, reminders, refunds and student risk monitoring.

The application supports two main user roles:

1. **Accounts Executive:** Manages administrative and financial operations, including student records, fee plans, payments, reminders, refunds and risk assessments.
2. **Parent:** Accesses the Parent Portal to view linked student information, check fee dues, track installments, view reminders and make simulated payments.

This document explains how to clone, configure, install, run and test EduLedger locally. It also describes the cloud deployment architecture, environment variables and demo login credentials.

# 2. Project Architecture

EduLedger follows a frontend-backend architecture. The frontend communicates with the backend through REST APIs.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React.js | User interface and interactions |
| Backend | Python, Django | Application logic and business operations |
| API Layer | Django REST Framework | REST API communication |
| Database | PostgreSQL | Persistent application data |
| Authentication | JWT | Login and API authentication |
| Frontend Hosting | Vercel | React application deployment |
| Backend Hosting | Render | Django application deployment |
| Database Hosting | Neon | Managed PostgreSQL database |

## 2.1 How the Application Works

1. A user opens the React frontend in a browser.
2. The user enters their login credentials.
3. The frontend sends the credentials to the Django authentication API.
4. Django validates the credentials and returns JWT tokens.
5. The frontend uses the access token when calling protected APIs.
6. Django checks authentication and role-based permissions.
7. The backend retrieves or updates information in PostgreSQL.
8. The API returns the requested information to the frontend.
9. React displays the information.

During local development, the frontend and backend run independently and communicate over HTTP.

# 3. System Requirements

Install the following software before setting up the project.

| Software | Purpose |
|---|---|
| Python 3 | Runs the Django backend |
| pip | Installs Python dependencies |
| Node.js | Runs the React development environment |
| npm | Installs frontend dependencies |
| PostgreSQL | Stores application data |
| Git | Clones and manages the repository |

Verify the installations:

```bash
python --version
pip --version
node --version
npm --version
git --version
```

Make sure PostgreSQL is installed and its database service is running.

# 4. Clone the GitHub Repository

Open a terminal or command prompt.

```bash
git clone https://github.com/Kashishghuliani/EduLedger.git
cd EduLedger
```

The project has the following main structure:

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
│   └── requirements.txt
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

# 5. Backend Setup – Local Installation

The backend handles authentication, database operations, fee calculations, payment processing, reminder generation, refunds and risk assessments.

## Step 1: Open the backend directory

```bash
cd backend
```

All backend commands in this section should be executed from this directory.

## Step 2: Create a Python virtual environment

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

For macOS or Linux:

```bash
source venv/bin/activate
```

After activation, the terminal should display the virtual environment name.

## Step 3: Install backend dependencies

```bash
pip install -r requirements.txt
```

This installs Django, Django REST Framework, database drivers, authentication packages and other dependencies listed in the requirements file.

## Step 4: Configure backend environment variables

Create a file named `.env` inside the `backend` directory.

Add the environment variables expected by `backend/config/settings.py`.

```text
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=eduledger
DB_USER=your-postgres-username
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
DB_SSLMODE=prefer

CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

Use the exact variable names and formats expected by the project's settings file.

**Important:**

- Do not commit the `.env` file to GitHub.
- Do not expose database passwords or Django secret keys.
- Make sure the database configuration matches your local PostgreSQL installation.
- Configure the database SSL mode appropriately for your environment.

## Step 5: Create the PostgreSQL database

Open PostgreSQL using pgAdmin or the PostgreSQL command-line interface.

Create a database named `eduledger`:

```sql
CREATE DATABASE eduledger;
```

Make sure the database credentials in the backend environment file match your PostgreSQL configuration.

## Step 6: Apply database migrations

Run:

```bash
python manage.py migrate
```

This creates the database tables corresponding to the existing Django migrations.

If new models have been added during development and migrations have not yet been generated, run:

```bash
python manage.py makemigrations
python manage.py migrate
```

For a fresh installation from the repository, existing migration files should already be included.

## Step 7: Create demo accounts and sample data

EduLedger provides a single management command to create or update the demo accounts and associated sample records.

Run:

```bash
python manage.py seed_client_demo
```

This command prepares the following demo accounts:

- Accounts Executive: `admin_demo`
- Parent: `parent_aarav`
- Parent: `parent_ishita`
- Parent: `parent_mohit`

It also creates or updates:

- Demo centre
- Three batches
- Three student records
- Parent-student relationships
- Fee plans and installments
- Successful mock payments and receipt records for the applicable students

### Demo student records

| Student ID | Student Name | Batch | Due Date | Installment Amount | Paid | Outstanding |
|---|---|---|---|---:|---:|---:|
| STU-0412 | Aarav Meena | JEE 2027 Morning | 10 Oct 2026 | ₹30,000 | ₹30,000 | ₹0 |
| STU-0587 | Ishita Sharma | JEE 2027 Evening | 10 Oct 2026 | ₹30,000 | ₹15,000 | ₹15,000 |
| STU-0219 | Mohit Gurjar | NEET 2027 Morning | 15 Nov 2026 | ₹40,000 | ₹0 | ₹40,000 |

All three students belong to the demo centre `Jaipur Main Centre`.

These are sample single-installment fee plans for demonstrating the application. They do not represent complete annual coaching fee schedules.

### Demo credentials

| Account Type | Username | Password | Demo Mobile |
|---|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` | `9876543210` |
| Parent – Aarav | `parent_aarav` | `Parent@123` | `9876543211` |
| Parent – Ishita | `parent_ishita` | `Parent@123` | `9876543212` |
| Parent – Mohit | `parent_mohit` | `Parent@123` | `9876543213` |

The mobile numbers are demonstration values and should not be used for actual message delivery.

**Important:**

- Run `seed_client_demo` instead of the older `create_demo_accounts` and `link_demo_parent` commands.
- The older commands are no longer part of the documented setup process.
- The seed command configures the demo account passwords.
- Running the seed command again updates the intended demo records; it is not a general-purpose database reset.
- Use a clean development database for initial evaluation.
- Do not run demo seeding against a production database containing real institute records without reviewing the command first.

## Step 8: Start the Django backend

Run:

```bash
python manage.py runserver
```

The Django development server will be available at:

```text
http://127.0.0.1:8000/
```

Keep this terminal running while using the frontend.

# 6. Frontend Setup – Local Installation

The frontend is developed using React and provides separate interfaces for Accounts Executives and Parents.

## Step 1: Open a new terminal

Keep the backend terminal running.

Open another terminal and navigate to the frontend directory:

```bash
cd EduLedger/frontend
```

## Step 2: Install frontend dependencies

```bash
npm install
```

This installs the packages required by the React application.

The `package-lock.json` file helps maintain consistent dependency versions.

## Step 3: Configure the backend API URL

The frontend communicates with the Django backend through Axios.

For local development, the API base URL should point to:

```text
http://127.0.0.1:8000/api/
```

If the Axios configuration uses a Vite environment variable, configure the variable:

```text
VITE_API_URL=http://127.0.0.1:8000/api/
```

Check the existing Axios configuration before changing it to ensure the frontend reads the correct variable.

## Step 4: Start the React application

Run:

```bash
npm run dev
```

The frontend development server will generally be available at:

```text
http://localhost:5173/
```

Open this address in a browser to access EduLedger.

**Important:** Both the backend and frontend development servers must be running simultaneously.

# 7. Demo Login Credentials

The application includes four demo accounts for reviewing the different access levels.

| Account Type | Username | Password |
|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` |
| Parent – Aarav | `parent_aarav` | `Parent@123` |
| Parent – Ishita | `parent_ishita` | `Parent@123` |
| Parent – Mohit | `parent_mohit` | `Parent@123` |

## 7.1 Accounts Executive Account

The Accounts Executive can explore the administrative features.

**Dashboard**
- View overall fee collection information.
- View outstanding fee amounts.
- Review fee ageing information.
- View centre and batch-level summaries.
- Monitor open counsellor tasks.

**Account and Student Management**
- Create and manage parent accounts.
- Add students and associate them with parents.
- Manage coaching centres.
- Create batches under individual centres.

**Fee Management**
- Create student fee plans.
- Configure installment amounts and due dates.
- View student fee ledgers.
- Track pending, partial and paid installments.

**Payments**
- Simulate successful and failed payments.
- Record successful payment transactions.
- Generate payment receipt records.
- Update installment balances.
- Stop pending reminders when an installment is fully paid.

**Reminders**
- Generate fee reminder records.
- View reminder status and message language.
- Generate reminders for eligible upcoming and overdue installments.

**Refund Management**
- Calculate refunds using the implemented pro-rata approach.
- View refund records and processing deadlines.

**Risk Monitoring**
- Assess students using predefined risk rules.
- View risk levels and assessment reasons.
- Manage counsellor follow-up tasks.
- Mark incorrect assessments as false positives.

## 7.2 Parent Account

The Parent account provides access to the Parent Portal.

After logging in, the parent can:

- View linked student information.
- Check total course fees.
- View the amount already paid.
- Check outstanding fee balances.
- View installment due dates and payment statuses.
- Make simulated payments.
- View in-app fee reminder notifications.
- View the attendance percentage displayed for the linked student.

Parent access is restricted to student information associated with the logged-in parent account.

# 8. Reminder Generation and Parent Notifications

EduLedger generates fee reminder records based on installment due dates.

Reminder generation can be triggered through the Accounts Executive interface or the backend management command.

**API endpoint:**

```text
POST /api/reminders/generate/
```

**Management command:**

```bash
python manage.py send_reminders
```

The reminder-generation process:

1. Checks eligible pending and partially paid installments.
2. Compares installment due dates with the configured reminder conditions.
3. Identifies the appropriate reminder type.
4. Selects the parent's preferred language.
5. Creates reminder records in PostgreSQL.
6. Avoids duplicate reminders for the same installment and reminder type.
7. Makes reminder records available for the relevant Parent Portal.

### Configured reminder rules

| Condition | Reminder Type |
|---|---|
| Exactly three days before the due date | BEFORE |
| On the due date | DUE |
| Three or more days after the due date | AFTER |

For example, an installment due on 15 November receives a BEFORE reminder when the generation command runs on 12 November.

An outstanding installment that is already overdue by three or more days is eligible for an AFTER reminder.

**Important:**

- The endpoint is restricted to the Accounts Executive role.
- Reminder records are stored in PostgreSQL.
- Parent notifications are displayed inside the Parent Portal.
- Fully paid installments have their pending reminders marked as skipped.
- Partial payments do not stop reminders while an outstanding balance remains.
- The generation command must be triggered; a recurring background scheduler has not been confirmed.
- Actual SMS, WhatsApp and email delivery services are not integrated.

# 9. Application Workflows

## 9.1 Account Management

The Accounts Executive manages the institute's basic records.

The main relationships are:

```text
Centre
  |
  └── Batch
        |
        └── Student
              |
              └── Parent
```

A centre can contain multiple batches, and a batch can contain multiple students.

Each student is associated with a parent account. A parent can be linked to multiple students.

## 9.2 Fee Management

1. The Accounts Executive selects a student.
2. A fee plan is created with the total fee and applicable discount.
3. The payable amount is calculated.
4. The payable amount is divided into installments.
5. Each installment receives an amount and due date.
6. The system tracks payments against each installment.
7. The outstanding amount is updated as payments are recorded.

## 9.3 Payment Processing

EduLedger uses a simulated payment flow for demonstration.

1. The Parent opens the fee ledger.
2. The Parent selects an installment.
3. The application sends a payment request to the backend.
4. The backend processes the simulated success or failure result.
5. For successful payments, a payment record and receipt record are created.
6. The paid amount and installment status are updated.
7. When an installment is fully paid, its pending reminders are marked as skipped.

No actual money is transferred because a real payment gateway is not integrated.

## 9.4 Refund Calculation

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

The calculation represents the application's demonstration logic and is not an institute-confirmed refund policy.

## 9.5 Student Risk Assessment

The risk monitoring module evaluates student information using predefined conditions.

The current implementation uses rule-based risk assessment, including factors such as low attendance and overdue installments.

The system calculates a risk score, assigns a risk level and stores the reasons for the assessment.

Accounts Executives can review assessments, manage counsellor follow-up tasks and mark incorrect assessments as false positives.

**Important:** The current implementation does not use a trained machine-learning model.

# 10. Deployment Architecture

EduLedger is deployed using three cloud services.

| Component | Hosting Platform | Responsibility |
|---|---|---|
| Frontend | Vercel | Hosts the React application |
| Backend | Render | Hosts the Django application |
| Database | Neon | Hosts PostgreSQL |

## 10.1 Frontend Deployment – Vercel

The React frontend is deployed on Vercel.

**Live frontend:**

https://edu-ledger-nine.vercel.app/

The frontend source code is maintained in the GitHub repository.

Vercel builds and deploys the frontend from the configured repository and branch.

The frontend communicates with the deployed backend using the configured API base URL.

## 10.2 Backend Deployment – Render

The Django backend is deployed on Render.

**Backend service:**

https://eduledger-ccpl.onrender.com/

The Render service uses the following configuration:

| Setting | Configuration |
|---|---|
| Repository | `Kashishghuliani/EduLedger` |
| Branch | `main` |
| Root Directory | `backend/` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn config.wsgi:application` |
| Region | Ohio, US East |

Render installs the Python dependencies and starts the Django application using Gunicorn.

Database migrations must be applied to the production database when new migrations are introduced.

## 10.3 Database Deployment – Neon

EduLedger uses Neon for its hosted PostgreSQL database.

Neon provides managed PostgreSQL database hosting.

The Render backend connects to Neon using database connection details configured through environment variables.

The database is hosted in the US East 2 (Ohio) region, matching the Render service's Ohio region.

## 10.4 Deployment Request Flow

```text
             USER BROWSER
                  |
                  v
          VERCEL FRONTEND
         React Application
                  |
              HTTPS API
                  |
                  v
          RENDER BACKEND
       Django REST Framework
                  |
          DATABASE CONNECTION
                  |
                  v
           NEON POSTGRESQL
           Persistent Storage
```

## 10.5 Deployment Process

The general deployment process is:

1. Push the application source code to GitHub.
2. Configure the frontend project in Vercel.
3. Configure the backend web service in Render.
4. Configure the PostgreSQL database in Neon.
5. Add the required environment variables to the hosting services.
6. Configure the frontend API URL to point to the deployed Render backend.
7. Configure backend allowed hosts and CORS origins.
8. Apply database migrations.
9. Run the demo seed command only when the intended demo records need to be prepared.
10. Verify the deployed application using the live frontend.
11. Generate reminder records through the Accounts Executive reminder-generation action or management command when required.

# 11. Environment Variables

Environment variables separate application configuration from source code.

## 11.1 Backend Environment Variables

Configure these variables in the backend `.env` file for local development and in Render's environment settings for deployment.

| Variable Name | Purpose |
|---|---|
| `SECRET_KEY` | Django cryptographic signing key |
| `DEBUG` | Controls debug mode |
| `ALLOWED_HOSTS` | Defines permitted backend hosts |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | PostgreSQL server hostname |
| `DB_PORT` | PostgreSQL connection port |
| `DB_SSLMODE` | PostgreSQL SSL configuration |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend origins |
| `CSRF_TRUSTED_ORIGINS` | Trusted origins for CSRF validation |

## 11.2 Frontend Environment Variables

If the frontend Axios configuration reads the API URL from Vite environment variables, configure:

| Variable Name | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL |

For local development, it should point to the local Django API.

For production, it should point to the deployed Render API.

## 11.3 Environment Variable Security

- Never commit `.env` files containing secrets.
- Never expose database credentials in frontend code.
- Do not place private credentials in GitHub.
- Configure backend secrets through Render's environment settings.
- Configure frontend variables through Vercel's environment settings.
- Only use public frontend configuration for values that are safe to expose to browsers.

# 12. Important Implementation Limitations

The following limitations should be considered during evaluation.

1. **Mock Payments:** Payments are simulated. No real payment gateway or financial transaction is involved.

2. **Reminder Delivery:** Reminders are generated and stored in the database and displayed as in-app Parent Portal notifications. External SMS, WhatsApp and email delivery services are not integrated.

3. **Reminder Scheduling:** Reminder generation is triggered manually through the Accounts Executive interface or management command. An automatic recurring scheduler has not been confirmed.

4. **Risk Assessment:** Risk levels are calculated using predefined rules rather than a trained machine-learning model.

5. **Refund Calculation:** The refund amount follows an assumed pro-rata calendar-day calculation. It is not based on a confirmed institute-specific refund policy.

6. **Attendance:** The Parent Portal displays the student's attendance percentage. Detailed date-wise attendance history is not currently documented as part of the implemented portal.

7. **Test Scores:** A `TestScore` model exists in the backend. Parent-facing test-score display should be considered incomplete unless the corresponding API and frontend functionality are available.

8. **Local Development:** The commands in this guide use local development servers and are intended for local evaluation rather than production hosting.

# 13. Troubleshooting

| Problem | Possible Cause | Solution |
|---|---|---|
| Backend does not start | Missing dependencies or configuration | Activate the virtual environment, install requirements and check `.env`. |
| Database connection fails | PostgreSQL is stopped or credentials are incorrect | Start PostgreSQL and verify the database configuration. |
| Migration error | Database or migration configuration issue | Check the database connection and migration files. |
| Frontend packages are missing | Dependencies have not been installed | Run `npm install` inside the frontend directory. |
| Frontend cannot reach backend | Backend is not running or API URL is incorrect | Start Django and verify the Axios base URL. |
| Login fails | Demo account does not exist or credentials are incorrect | Run `python manage.py seed_client_demo`. |
| Parent cannot see student records | Student is not linked to the logged-in parent | Verify the student's parent relationship and run the demo seed command if appropriate. |
| CORS error | Frontend origin is not allowed by the backend | Verify `CORS_ALLOWED_ORIGINS` in the backend configuration. |
| Reminders are not generated | No eligible installments or reminder-generation request was not triggered | Check installment status, due dates and the reminder-generation action. |

# 14. Application URLs

## Local Development

| Component | URL |
|---|---|
| React Frontend | http://localhost:5173/ |
| Django Backend | http://127.0.0.1:8000/ |
| Django Admin | http://127.0.0.1:8000/admin/ |

## Deployed Application

| Component | URL |
|---|---|
| Live Frontend | https://edu-ledger-nine.vercel.app/ |
| Backend Service | https://eduledger-ccpl.onrender.com/ |
| GitHub Repository | https://github.com/Kashishghuliani/EduLedger |

The Django Admin interface requires an authorized superuser account.

# 15. Final Notes for Reviewers

- Run PostgreSQL before starting the local backend.
- Activate the Python virtual environment before executing backend commands.
- Run the backend and frontend in separate terminals.
- Make sure the frontend API URL points to the correct backend.
- Run `python manage.py seed_client_demo` to prepare the demonstration accounts and sample records.
- Use the provided demo accounts to explore both application roles.
- Use the Accounts Executive interface to manage fee records and generate reminders.
- Use only sample or dummy information during evaluation.
- The deployed application and local application may use different database configurations.
- Demo accounts are intended for evaluation and should not be used as production credentials.

---

**GitHub Repository:**  
https://github.com/Kashishghuliani/EduLedger

**Live Application:**  
https://edu-ledger-nine.vercel.app/

**End of Deployment and Setup Guide**