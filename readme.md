# EduLedger – Coaching Institute Fee Management System

**A centralized platform for student fee management, parent communication, payment tracking and student monitoring.**

EduLedger is a web-based management system designed for coaching institutes to manage students, parents, centres, batches, fee plans, installment payments, reminders, refunds and student risk assessments through a centralized platform.

The application provides two role-based portals:

- **Accounts Executive Portal:** Manages parent accounts, student records, centres, batches, fee plans, payments, reminders, refunds and student risk monitoring.
- **Parent Portal:** Allows parents to view their linked students, check fee dues, track installments, view payment receipts and reminders, and make simulated payments.

---

# 1. Problem Statement

Coaching institutes often manage student registrations, fee collections, installment schedules and parent communication using spreadsheets and manual processes.

As the number of students and centres increases, managing these operations becomes difficult.

Common challenges include:

- Maintaining separate student and parent records.
- Organizing students across multiple centres and batches.
- Tracking installment due dates and outstanding fees.
- Following up manually with parents for pending payments.
- Identifying partial payments and reconciling balances.
- Calculating refunds when students withdraw from courses.
- Identifying students who may require additional attention.
- Providing parents with transparent access to fee information.

EduLedger addresses these challenges by providing a centralized system where accounts executives can manage institute operations and parents can independently monitor their children's fee information.

# 2. User Roles

## 2.1 Accounts Executive

The Accounts Executive has access to the institute management portal.

Responsibilities include:

- Managing parent accounts.
- Registering students.
- Creating and managing centres.
- Creating batches and assigning them to centres.
- Creating student fee plans.
- Tracking installment payments.
- Monitoring outstanding balances.
- Generating fee reminders.
- Calculating student refunds.
- Assessing student risk and managing counsellor tasks.
- Monitoring institute-level financial statistics through the dashboard.

## 2.2 Parent

The Parent has access to a separate parent portal.

Available features include:

- Logging in using assigned credentials.
- Viewing students linked to their account.
- Viewing student information.
- Viewing total fees, amount paid and outstanding balance.
- Monitoring installment due dates and statuses.
- Viewing payment history and available receipts.
- Viewing generated fee reminders.
- Making simulated payments.
- Checking updated fee information after payments.

Parents can only access student information associated with their own account.

# 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | JavaScript |
| Styling | CSS |
| Routing | React Router |
| API Communication | Axios |
| Icons | React Icons |
| Backend | Python |
| Backend Framework | Django |
| API Framework | Django REST Framework |
| Authentication | JWT / Simple JWT |
| Database | PostgreSQL |
| API Testing | Postman |
| Version Control | Git and GitHub |

# 4. Application Modules and Features

## 4.1 Dashboard

The Dashboard provides an overall view of the institute's fee and student management activities.

**Student Statistics**
- Total number of students.
- Student distribution across the institute.

**Fee Collection**
- Total payable fee amount.
- Total amount collected.
- Total outstanding fee amount.

**Outstanding Fee Monitoring**
- Displays overdue fee information.
- Categorizes outstanding payments based on ageing.
- Helps identify payments requiring follow-up.

**Centre-wise and Batch-wise Information**
- Provides fee-related information across centres and batches.
- Helps compare collection and outstanding amounts across institute locations.

The dashboard retrieves aggregated information from the backend through the dashboard API.

## 4.2 Account Management

Account Management provides a centralized interface for managing institute records.

It contains four major modules:

1. Parent Management
2. Student Management
3. Centre Management
4. Batch Management

### A. Parent Management

Features:

- Create parent accounts.
- Enter parent names and usernames.
- Add contact information, including phone numbers.
- Configure preferred communication language.
- Store credentials securely through Django authentication.
- View existing parent accounts.
- Associate parents with their respective students.

| Field | Description |
|---|---|
| Username | Unique login username |
| Phone Number | Parent contact number |
| Preferred Language | English or Hindi |
| Role | Parent |

**Parent Account Creation Workflow**

1. The Accounts Executive opens Account Management.
2. Selects the Parents section.
3. Enters the parent's information.
4. Provides login credentials.
5. Selects the preferred communication language.
6. Submits the form.
7. The backend creates the parent account.

Passwords are stored as hashes through Django authentication rather than as plain text.

A parent can be linked to multiple students.

### B. Student Management

Features:

- Register new students.
- Assign unique student IDs.
- Enter student details.
- Associate students with parent accounts.
- Assign students to existing batches.
- Identify the student's centre through the assigned batch.
- Maintain student attendance percentage.
- View student information.
- Access individual student fee ledgers.
- Create fee plans for students.

| Field | Description |
|---|---|
| Student ID | Unique student identifier |
| Student Name | Student's name |
| Parent | Linked parent account |
| Batch | Assigned batch |
| Attendance Percentage | Attendance information |

**Student Registration Workflow**

1. The Accounts Executive opens Account Management.
2. Selects the Students section.
3. Enters the student's details.
4. Selects an existing parent account.
5. Selects the appropriate batch.
6. Submits the registration form.
7. The backend creates the student record.

### C. Centre Management

Features:

- Create new centres.
- Enter centre names and locations.
- View existing centres.
- Maintain a centralized list of institute locations.
- Associate batches with their respective centres.

| Field | Description |
|---|---|
| Centre Name | Name of the coaching centre |
| Location | Physical location of the centre |

### D. Batch Management

Features:

- Create new batches.
- Enter batch names.
- Select an existing centre.
- View existing batches.
- Organize students according to batch.

| Field | Description |
|---|---|
| Batch Name | Name of the batch |
| Centre | Centre to which the batch belongs |

### How Account Management Modules Work Together

```text
CENTRE
   |
   v
 BATCH
   |
   v
 STUDENT
   |
   v
 PARENT
   |
   v
PARENT PORTAL
```

- One centre can have multiple batches.
- Each batch belongs to one centre.
- One batch can contain multiple students.
- Each student belongs to one batch.
- One parent can be linked to multiple students.
- Each student is associated with one parent account.

## 4.3 Fee Management

Fee Management allows the Accounts Executive to create and maintain student fee structures.

Features:

- Create fee plans for students.
- Enter total course fees.
- Apply discounts.
- Calculate the final payable amount.
- Divide payable fees into installments.
- Assign installment due dates.
- Track payments against individual installments.
- View outstanding balances.

**Fee Plan Calculation**

```text
Payable Amount = Total Fee - Discount

Outstanding Amount = Payable Amount - Total Paid
```

**Example**

| Description | Amount |
|---|---:|
| Total Course Fee | ₹1,00,000 |
| Discount | ₹1,000 |
| Payable Amount | ₹99,000 |
| Total Paid | ₹30,000 |
| Outstanding | ₹69,000 |

### Installment Management

The payable amount can be divided into multiple installments.

Example:

| Installment | Amount | Due Date |
|---|---:|---|
| First | ₹33,000 | 1 October |
| Second | ₹33,000 | 15 November |
| Third | ₹33,000 | 15 December |

**Installment Statuses**

| Status | Meaning |
|---|---|
| Pending | No payment has been received |
| Partial | Some payment has been received |
| Paid | Entire installment amount has been paid |

The backend updates installment statuses as payments are recorded.

## 4.4 Payment Management

The Payment Management module handles student installment payment records.

The current project uses a simulated payment workflow for demonstration.

Features:

- Simulate successful payments.
- Simulate failed payments.
- Support partial payments.
- Support full installment payments.
- Generate unique payment references.
- Use idempotency keys to help prevent duplicate payment processing.
- Update installment payment amounts.
- Recalculate installment statuses.
- Generate payment receipt records after successful payments.
- Update outstanding balances.

**Payment Workflow**

```text
Parent opens fee ledger
        |
        v
Selects an installment
        |
        v
Enters payment amount
        |
        v
Submits mock payment request
        |
        v
Backend validates request
        |
        v
Payment processed
        |
        v
Payment record created
        |
        v
Installment balance updated
        |
        v
Installment status recalculated
        |
        v
Receipt record generated on success
        |
        v
Parent portal updated
```

**Partial Payment Example**

```text
Installment Amount = ₹33,000
Paid Amount        = ₹10,000
Remaining Balance  = ₹23,000
Status             = PARTIAL
```

If the parent subsequently pays the remaining ₹23,000, the installment status becomes `PAID`.

**Important:** No actual money is transferred. A real payment gateway such as Razorpay or Stripe is not integrated.

## 4.5 Automated Fee Reminders

The Reminder Management module generates reminders for upcoming and overdue installment payments.

**Reminder Schedule**

| Reminder Type | Trigger |
|---|---|
| Before Due | 3 days before due date |
| Due Today | On the due date |
| After Due | 3 days after due date |

**Features**

- Generate reminder records based on installment due dates.
- Support English and Hindi message templates.
- Use the parent's preferred language.
- Store reminders in PostgreSQL.
- Track reminder status.
- Prevent duplicate reminder creation according to configured duplicate-checking logic.
- Display reminders in the Parent Portal.
- Skip pending reminders when an installment is fully paid.

**Reminder Workflow**

```text
Installment created
        |
        v
Due date checked
        |
        v
Reminder conditions evaluated
        |
        v
Reminder message generated
        |
        v
Parent language selected
        |
        v
Reminder saved in database
        |
        v
Reminder displayed in Parent Portal
```

**Reminder Statuses**

| Status | Meaning |
|---|---|
| Pending | Reminder is awaiting processing |
| Sent | Reminder is marked as sent |
| Skipped | Reminder is no longer required |

**Payment and Reminder Relationship**

- If an installment is partially paid, reminders remain active while a balance is outstanding.
- If an installment is fully paid, pending reminders for that installment are marked as skipped.
- Already sent reminders are not treated as pending reminders.

**Important:** Reminder records are generated and displayed in the Parent Portal. Actual SMS, WhatsApp and email delivery services are not integrated.

## 4.6 Refund Management

The Refund Management module allows the Accounts Executive to calculate a student's refund when the student withdraws from the course.

**Information Required**

- Student.
- Course start date.
- Course end date.
- Withdrawal date.
- Amount paid.

**Refund Calculation**

The current demonstration uses a pro-rata calendar-day calculation.

```text
Refund Amount =
Amount Paid × Remaining Course Days / Total Course Days
```

Where:

```text
Total Course Days = Course End Date - Course Start Date

Remaining Course Days = Course End Date - Withdrawal Date
```

The remaining days are restricted to the course duration.

**Example**

- Amount paid: ₹30,000.
- Course duration: 30 calendar days.
- Remaining course days: 20.

```text
Refund = 30,000 × 20 / 30

Refund = ₹20,000
```

**Additional Features**

- Calculate refund amounts.
- Retrieve successful payment amounts for the student.
- Calculate a processing deadline.
- Maintain refund records.
- Track refund status.

The current implementation calculates the processing deadline as 10 days after the withdrawal date.

**Note:** The refund formula and processing deadline are demonstration assumptions, not a confirmed institute-specific refund policy.

## 4.7 Student Risk Monitoring

The Risk Monitoring module helps the Accounts Executive identify students who may require additional attention.

The current implementation uses rule-based scoring rather than a trained machine-learning model.

Potential assessment factors include:

- Attendance information.
- Overdue installments.
- Academic performance information, where available to the assessment logic.

**Student Assessment**
- Assess individual students.
- Calculate risk scores using configured rules.
- Determine risk levels.
- Store assessment reasons.

**Assessment Results**
- View previous risk assessments.
- Review student risk levels.
- Understand why a student was flagged.

**Counsellor Follow-up Tasks**
- Manage counsellor follow-up tasks associated with student assessments.
- Display open follow-up tasks.
- Track task completion.

**False Positive Handling**
- Allow the Accounts Executive to mark an assessment as a false positive.
- Preserve the assessment record for reference.

**Risk Assessment Workflow**

```text
Student information
        |
        v
Evaluate configured risk conditions
        |
        v
Calculate risk score
        |
        v
Assign risk level
        |
        v
Store assessment reasons
        |
        v
Create/manage follow-up task
        |
        v
Accounts Executive reviews task
```

The risk engine is rule-based and does not use a trained machine-learning model.

## 4.8 Parent Portal

The Parent Portal provides parents with a dedicated interface to access their linked students' information.

**Student Information**
- View linked student records.
- View student names and IDs.
- View batch information.
- View available attendance information.

**Fee Summary**
- View total payable fees.
- View total amount paid.
- View outstanding balances.
- View pending installments.

**Installment Details**
- View installment amounts.
- View due dates.
- View payment statuses.
- View remaining balances.

**Payment History**
- View available payment records.
- Access associated receipt information.

**Notifications**
- View generated fee reminders.
- Check reminder types and statuses.
- View reminder details and scheduled dates.

**Mock Payments**
- Select an installment.
- Enter a payment amount.
- Simulate successful or failed payments.
- View updated fee information after successful payments.

**Parent Access Restrictions**

Parents cannot:

- Create or modify fee plans.
- Create student records.
- Manage institute centres or batches.
- Access other parents' student information.
- Access Accounts Executive management features.

The backend uses role-based permissions and parent-specific student filtering.

# 5. System Architecture

EduLedger follows a client-server architecture.

```text
                    USERS
                      |
          -------------------------
          |                       |
   Accounts Executive           Parent
          |                       |
          v                       v
   Accounts Portal           Parent Portal
          |                       |
          ----------- ------------
                      |
                React Frontend
                      |
                  Axios API
                      |
              Django REST API
                      |
          Authentication & Permissions
                      |
          ----------------------------
          |       |       |          |
       Accounts Students Fees     Payments
          |       |       |          |
          ----------------------------
                      |
                 PostgreSQL
                      |
          -------------------------
          |           |           |
       Reminders    Refunds    Dashboard
                      |
                     Risk
```

### Request and Authentication Flow

1. The user opens the React application.
2. The user enters their username and password.
3. React sends credentials to the Django authentication endpoint.
4. Django validates the credentials.
5. JWT access and refresh tokens are returned.
6. The frontend uses the access token for authenticated requests.
7. Django validates the token and checks the user's role.
8. The requested operation is performed.
9. PostgreSQL stores or retrieves the relevant information.
10. The backend returns the response.
11. React updates the user interface.

# 6. Database Design

EduLedger uses PostgreSQL as its relational database.

| Model | Responsibility |
|---|---|
| User | Stores parent and Accounts Executive accounts |
| Centre | Stores institute centre information |
| Batch | Stores batches associated with centres |
| Student | Stores student details and parent/batch relationships |
| TestScore | Stores academic performance information |
| FeePlan | Stores course fees, discounts and payable amounts |
| Installment | Stores installment amounts, due dates and statuses |
| Payment | Stores payment transactions |
| Receipt | Stores payment receipt information |
| Reminder | Stores generated fee reminders |
| Refund | Stores refund calculations and records |
| RiskAssessment | Stores student risk scores and assessment reasons |
| CounsellorTask | Stores counsellor follow-up tasks |

### Database Relationships

```text
User (Parent)
     |
     | One-to-Many
     |
   Student
     |
     | Many-to-One
     |
    Batch
     |
     | Many-to-One
     |
   Centre

Student
     |
     | One-to-One
     |
   FeePlan
     |
     | One-to-Many
     |
  Installment
     |
     | One-to-Many
     |
   Payment
     |
     | One-to-One
     |
   Receipt
```

Additional relationships:

- A student can have multiple test scores.
- A student can have multiple risk assessments.
- A student can have multiple refund records.
- A student can have multiple counsellor tasks.
- An installment can have multiple reminders.
- A risk assessment can be associated with a counsellor task.

# 7. Project Folder Structure

```text
EduLedger/
│
├── backend/
│   ├── config/
│   │
│   ├── accounts/
│   ├── students/
│   │   └── management/
│   │       └── commands/
│   │           └── seed_client_demo.py
│   │
│   ├── fees/
│   ├── payments/
│   ├── reminders/
│   ├── refunds/
│   ├── risk/
│   ├── dashboard/
│   │
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── README.md
└── deployment.md
```

# 8. API Endpoints

The following are the documented API routes. Verify exact methods and paths against the current Django URL configuration before treating this list as an exhaustive API contract.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/token/` | Obtain JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Retrieve logged-in user details |
| GET | `/api/auth/parents/` | List parent accounts |
| POST | `/api/auth/parents/` | Create a parent account |

### Student Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/` | Retrieve accessible students |
| POST | `/api/students/` | Create a student |

### Centre Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/centres/` | Retrieve centres |
| POST | `/api/students/centres/` | Create a centre |

### Batch Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/batches/` | Retrieve batches |
| POST | `/api/students/batches/` | Create a batch |

### Fee Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fees/plans/` | Retrieve fee plans |
| POST | `/api/fees/plans/` | Create a fee plan |
| GET | `/api/fees/ledger/<student_id>/` | Retrieve a student's fee ledger |

### Payment Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/mock/` | Process a simulated payment |

### Reminder Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reminders/` | Retrieve accessible reminders |
| POST | `/api/reminders/generate/` | Generate reminder records |

### Refund Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/refunds/` | Retrieve refund records |
| POST | `/api/refunds/calculate/` | Calculate a refund |

### Risk Monitoring

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/risk/assess/<student_id>/` | Assess a student's risk |
| GET | `/api/risk/assessments/` | Retrieve risk assessments |
| POST | `/api/risk/false-positive/<assessment_id>/` | Mark an assessment as a false positive |
| GET | `/api/risk/tasks/` | Retrieve counsellor tasks |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/` | Retrieve dashboard statistics |

# 9. Installation and Setup

## Prerequisites

Install:

- Python.
- Node.js and npm.
- PostgreSQL.
- Git.

## Step 1: Clone the Repository

```bash
git clone https://github.com/Kashishghuliani/EduLedger.git
cd EduLedger
```

## Step 2: Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Step 3: Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=eduledger
DB_USER=your-postgres-username
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
DB_SSLMODE=prefer
```

Use the exact variable names expected by your Django settings.

Create the PostgreSQL database:

```sql
CREATE DATABASE eduledger;
```

## Step 4: Apply Migrations

```bash
python manage.py migrate
```

If you have made changes to Django models and need to generate new migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Create Demo Data

The project uses a single management command to create or update the demo Accounts Executive, parent accounts, centre, batches, students, fee plans, installments and sample payment records.

Run:

```bash
python manage.py seed_client_demo
```

The command prepares the following demo accounts and student records.

| Student ID | Student | Parent Username | Batch |
|---|---|---|---|
| STU-0412 | Aarav Meena | `parent_aarav` | JEE 2027 Morning |
| STU-0587 | Ishita Sharma | `parent_ishita` | JEE 2027 Evening |
| STU-0219 | Mohit Gurjar | `parent_mohit` | NEET 2027 Morning |

The demo centre is Jaipur Main Centre.

**Demo credentials**

| Role | Username | Password |
|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` |
| Parent | `parent_aarav` | `Parent@123` |
| Parent | `parent_ishita` | `Parent@123` |
| Parent | `parent_mohit` | `Parent@123` |

The command also creates sample payment and receipt records for Aarav and Ishita. Mohit's sample installment has no payment record.

**Sample fee data**

| Student | Installment Amount | Paid | Outstanding | Status |
|---|---:|---:|---:|---|
| Aarav Meena | ₹30,000 | ₹30,000 | ₹0 | Paid |
| Ishita Sharma | ₹30,000 | ₹15,000 | ₹15,000 | Partial |
| Mohit Gurjar | ₹40,000 | ₹0 | ₹40,000 | Pending |

The sample fee plans are demonstration records, not complete annual fee schedules.

**Important:**

- Run the command from the backend directory with the virtual environment activated.
- These credentials are for evaluation only.
- The demo phone numbers are dummy contact details.
- Avoid using these accounts for real parent communication.
- The command is intended to prepare the sample dataset; review its update behaviour before using it against a database containing important records.

## Step 6: Start Django

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

## Step 7: Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend API URL according to the Axios configuration in the project.

If the frontend uses `VITE_API_URL`, the local value may be:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

Start React:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

Both the backend and frontend terminals must remain running during local development. PostgreSQL must also be running.

# 10. Demo Login Credentials

The following accounts are provided for project evaluation.

| Role | Username | Password |
|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` |
| Parent | `parent_aarav` | `Parent@123` |
| Parent | `parent_ishita` | `Parent@123` |
| Parent | `parent_mohit` | `Parent@123` |

### Accounts Executive Access

The Accounts Executive can explore:

- Dashboard.
- Parent management.
- Student management.
- Centre management.
- Batch management.
- Fee management.
- Payment management.
- Reminder management.
- Refund management.
- Risk monitoring.

### Parent Access

The Parent can explore:

- Linked student information.
- Fee summaries.
- Installment details.
- Outstanding balances.
- Payment history and available receipts.
- Payment reminders.
- Simulated payments.

The demo parent account must have a linked student and an associated fee plan to display meaningful fee information.

**Security:** These are public demonstration credentials. Use only dummy data with these accounts. Do not reuse their passwords for real accounts.

# 11. Security and Access Control

EduLedger includes:

- JWT-based authentication.
- Password hashing through Django authentication.
- Role-based permissions.
- Parent-specific student filtering.
- Protected API endpoints.
- Database transaction handling for payment operations.
- Unique payment references.
- Idempotency keys for duplicate payment protection.

The Parent Portal is restricted to the authenticated parent's associated student records.

The Accounts Executive Portal contains institute management features and is protected by Accounts Executive permissions.

# 12. Current Implementation Scope and Limitations

Some integrations are intentionally simulated for demonstration.

| Feature | Current Implementation |
|---|---|
| Authentication | JWT-based authentication |
| Payments | Mock payment workflow |
| Payment receipts | Database receipt records |
| Reminders | Database reminder generation and Parent Portal display |
| SMS/WhatsApp | Not integrated |
| Email delivery | Not integrated |
| Risk assessment | Rule-based scoring |
| Refund calculation | Pro-rata calendar-day assumption |
| Database | PostgreSQL |
| Test score model | Available in backend; parent-facing display should be verified separately |

### Important Assumptions

1. Mock payments demonstrate payment processing without an external payment gateway.
2. Reminder generation creates database records but does not send external messages.
3. The risk assessment system uses predefined rules rather than a trained machine-learning model.
4. Refund calculations use an assumed pro-rata calendar-day policy.
5. Counsellor tasks are managed through the application rather than automatically making calls.

# 13. Future Enhancements

Potential improvements include:

- Integration with Razorpay or another payment gateway.
- Actual SMS, WhatsApp and email reminder delivery.
- Downloadable PDF receipts.
- Detailed financial reports.
- Advanced centre-wise and batch-wise analytics.
- Configurable institute-specific refund policies.
- Improved audit logs.
- Notification read/unread functionality.
- Automated scheduled reminder execution.
- Machine-learning-based student risk prediction.
- Parent-facing test score history and academic progress.
- Database backups and production monitoring.

# 14. Project Objective

EduLedger brings the major fee management and student monitoring workflows of a coaching institute into one centralized platform.

The Accounts Executive can manage parents, students, centres, batches, fee plans, payments, reminders, refunds and risk assessments.

Parents receive a dedicated portal to view their children's fee information, monitor outstanding amounts, access available payment records and make simulated payments.

The system aims to improve operational organization, fee transparency and communication between coaching institutes and parents.

# 15. Project Links

- **GitHub Repository:** https://github.com/Kashishghuliani/EduLedger
- **Live Frontend:** https://edu-ledger-nine.vercel.app/
- **Backend Service:** https://eduledger-ccpl.onrender.com/

### Hosting Architecture

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

The backend uses environment variables for database credentials, secret configuration and deployment-specific settings. Never commit the `.env` file or expose production secrets in the repository.

---

**Built using React.js, Python, Django REST Framework and PostgreSQL.**