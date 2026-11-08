# EduLedger – Coaching Institute Fee Management System

**A centralized platform for student fee management, parent communication, payment tracking and student monitoring.**

EduLedger is a web-based management system designed for coaching institutes to manage students, parents, centres, batches, fee structures, installment payments, reminders, refunds and student risk assessments through a single platform.

The application provides two role-based portals:

- **Accounts Executive Portal:** Manages the institute's operational and financial activities, including parent accounts, student records, centres, batches, fee plans, payments, refunds and student monitoring.
- **Parent Portal:** Allows parents to access their linked students' academic and financial information, monitor fee dues, view reminders and make simulated payments.

---

# 1. Problem Statement

Coaching institutes often manage student registrations, fee collections, installment schedules and parent communication using spreadsheets and manual processes.

As the number of students and centres increases, managing these operations becomes difficult.

Some common challenges include:

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

EduLedger supports two primary user roles.

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
- Generating payment reminders.
- Calculating student refunds.
- Assessing student risk and managing counsellor tasks.
- Monitoring institute-level financial statistics through the dashboard.

## 2.2 Parent

The Parent has access to a separate parent portal.

Responsibilities and available features include:

- Logging in using assigned credentials.
- Viewing students linked to their account.
- Viewing each student's fee plan.
- Checking total fees, discounts and amount paid.
- Monitoring outstanding balances.
- Viewing installment due dates and statuses.
- Viewing payment reminders.
- Making simulated payments.
- Checking updated fee information after payments.

Parents can only access students associated with their own account.

---

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

---

# 4. Application Modules and Features

## 4.1 Dashboard

The Dashboard provides an overall view of the institute's fee and student management activities.

It helps the Accounts Executive understand the current operational and financial status without opening each individual section.

### Dashboard Information

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
- Provides a view of fee-related information across centres and batches.
- Helps compare collection and outstanding amounts across different institute locations.

**Counsellor Tasks**
- Displays open counsellor follow-up tasks.
- Helps the Accounts Executive track students who have been flagged for additional attention.

The dashboard retrieves aggregated information from the backend through the dashboard API.

---

## 4.2 Account Management

Account Management is an important section of the Accounts Executive portal.

It provides a centralized interface for managing the institute's basic operational records.

The section contains four major modules:

1. Parent Management
2. Student Management
3. Centre Management
4. Batch Management

These modules are connected to one another, ensuring that students are associated with the correct parents, centres and batches.

### A. Parent Management

Parent Management allows the Accounts Executive to create and maintain parent accounts.

Each parent account provides login access to the Parent Portal.

**Features**

- Create new parent accounts.
- Enter parent name and username.
- Add contact information, including phone number.
- Configure the parent's preferred communication language.
- Store account credentials securely through Django authentication.
- View existing parent accounts.
- Associate parents with their respective students.

**Parent Information**

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
8. The parent can subsequently log in to the Parent Portal.

The system uses Django's user authentication model, and passwords are stored as hashes rather than plain text.

A parent can be linked to multiple students. This allows a parent with multiple children enrolled in the institute to access their respective fee information through one account.

### B. Student Management

Student Management allows the Accounts Executive to register and maintain student records.

Every student is assigned a unique student ID and associated with a parent, centre and batch.

**Features**

- Register new students.
- Assign a unique student ID.
- Enter student name and details.
- Associate a student with an existing parent account.
- Assign a student to a batch.
- Organize students according to their centre through their batch.
- Maintain student attendance percentage.
- View student information.
- Access an individual student's fee ledger.
- Create a fee plan for a student when one does not exist.

**Student Information**

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
6. Submits the student registration form.
7. The backend creates the student record with the selected parent and batch relationships.
8. The student becomes available in the student management section.

**Fee Ledger Access**

The Students section also provides access to individual student fee ledgers.

The Accounts Executive can:
- View the student's total payable fee.
- View the total amount paid.
- Check the outstanding amount.
- View installment details.
- Create a fee plan if the student does not have one.

The student record and fee ledger are connected, so the Accounts Executive can manage student information and fee information from the same section.

### C. Centre Management

Centre Management allows the Accounts Executive to maintain the different physical locations of the coaching institute.

This is particularly useful for institutes operating across multiple locations.

**Features**

- Create new centres.
- Enter centre names.
- Store centre locations.
- View existing centres.
- Maintain a centralized list of institute locations.
- Associate batches with their respective centres.

**Centre Information**

| Field | Description |
|---|---|
| Centre Name | Name of the coaching centre |
| Location | Physical location of the centre |

**Centre Creation Workflow**

1. The Accounts Executive opens Account Management.
2. Selects the Centres section.
3. Enters the centre name.
4. Enters its location.
5. Submits the form.
6. The backend saves the centre record.
7. The newly created centre becomes available when creating batches.

For example, an institute can create centres such as:

- Jaipur Main Centre – Vaishali Nagar.
- Jaipur North Centre – Vidyadhar Nagar.
- Jaipur South Centre – Mansarovar.
- Jaipur East Centre – Malviya Nagar.

These are illustrative centre names for demonstration.

### D. Batch Management

Batch Management allows the Accounts Executive to organize students into academic or coaching batches.

Each batch is associated with a centre.

**Features**

- Create new batches.
- Enter batch names.
- Select an existing centre.
- View existing batches.
- Organize students according to batch.
- Maintain the relationship between batches and centres.

**Batch Information**

| Field | Description |
|---|---|
| Batch Name | Name of the batch |
| Centre | Centre to which the batch belongs |

**Batch Creation Workflow**

1. The Accounts Executive opens Account Management.
2. Selects the Batches section.
3. Enters the batch name.
4. Selects an existing centre.
5. Submits the form.
6. The backend creates the batch and associates it with the selected centre.
7. The batch becomes available when registering students.

For example:

| Batch | Centre |
|---|---|
| JEE 2027 Morning | Jaipur Main |
| NEET 2027 Morning | Jaipur Main |
| JEE 2027 Evening | Jaipur North |
| NEET 2027 Evening | Jaipur North |
| JEE 2028 Morning | Jaipur South |
| NEET 2028 Morning | Jaipur South |

### How Account Management Modules Work Together

The four modules are connected through database relationships.

```text
                 CENTRE
                    |
                    |
                  BATCH
                    |
                    |
                  STUDENT
                    |
                    |
                  PARENT
                    |
                    |
              PARENT PORTAL
```

The actual relationships are:

- One centre can have multiple batches.
- Each batch belongs to one centre.
- One batch can contain multiple students.
- Each student belongs to one batch.
- One parent can be linked to multiple students.
- Each student is associated with one parent account.

**Example Workflow**

Suppose the institute opens a new centre in Jaipur.

1. The Accounts Executive creates the centre.
2. Creates JEE and NEET batches under that centre.
3. Registers students and assigns them to the appropriate batches.
4. Associates each student with an existing parent account.
5. Creates a fee plan for each student.
6. Parents can log in and view their linked students' fee information.

This structure ensures that the institute's records remain organized and connected.

---

## 4.3 Fee Management

Fee Management allows the Accounts Executive to create and maintain student fee structures.

Each student has an individual fee plan.

**Features**

- Create fee plans for students.
- Enter total course fees.
- Apply discounts.
- Calculate the final payable amount.
- Divide the payable amount into installments.
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

For example:

| Installment | Amount | Due Date |
|---|---:|---|
| First | ₹33,000 | 1 October |
| Second | ₹33,000 | 15 November |
| Third | ₹33,000 | 15 December |

The Accounts Executive can view installment-wise payment information.

**Installment Statuses**

| Status | Meaning |
|---|---|
| Pending | No payment has been received |
| Partial | Some payment has been received |
| Paid | Entire installment amount has been paid |

The backend recalculates installment statuses as payments are recorded.

---

## 4.4 Payment Management

The Payment Management module handles student installment payment records.

The current project uses a mock payment workflow for demonstration.

**Features**

- Simulate successful payments.
- Simulate failed payments.
- Support partial payments.
- Support full installment payments.
- Generate unique payment references.
- Use idempotency keys to help prevent duplicate payment processing.
- Update installment payment amounts.
- Recalculate installment statuses.
- Generate payment receipts after successful payments.
- Update the student's outstanding balance.

### Payment Workflow

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
Backend validates the request
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
Receipt generated on success
          |
          v
Parent portal updated
```

### Partial Payment Example

Suppose an installment amount is ₹33,000.

The parent makes a payment of ₹10,000.

```text
Installment Amount = ₹33,000
Paid Amount        = ₹10,000
Remaining Balance  = ₹23,000
Status             = PARTIAL
```

If the parent subsequently pays the remaining ₹23,000, the installment status becomes `PAID`.

**Important:** This project does not currently integrate with Razorpay, Stripe or another real payment gateway. Payments are simulated for evaluation.

---

## 4.5 Automated Fee Reminders

The Reminder Management module helps the institute generate reminders for upcoming and overdue installment payments.

The system checks installment due dates and generates reminder records according to predefined rules.

### Reminder Schedule

| Reminder Type | Trigger |
|---|---|
| Before Due | 3 days before due date |
| Due Today | On the due date |
| After Due | 3 days after due date |

### Features

- Generate reminder records based on installment due dates.
- Support English and Hindi message templates.
- Use the parent's preferred language.
- Store reminders in the database.
- Track reminder status.
- Prevent duplicate reminder creation for the same installment, language, type and scheduled date.
- Display reminders in the Parent Portal.
- Stop pending reminders when an installment is fully paid.

### Reminder Workflow

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

### Reminder Statuses

| Status | Meaning |
|---|---|
| Pending | Reminder is awaiting processing |
| Sent | Reminder is marked as sent |
| Skipped | Reminder is no longer required |

### Payment and Reminder Relationship

- If an installment is partially paid, reminders remain active because a balance is outstanding.
- If an installment is fully paid, pending reminders for that installment are marked as skipped.
- Already sent reminders are not treated as pending reminders.

**Important:** The current implementation generates and stores reminder records. Actual SMS, WhatsApp and email delivery are not integrated.

---

## 4.6 Refund Management

The Refund Management module allows the Accounts Executive to calculate a student's refund when the student withdraws from the course.

### Information Required

- Student.
- Course start date.
- Course end date.
- Withdrawal date.
- Amount paid.

### Refund Calculation

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

### Example

Suppose:

- Amount paid: ₹30,000.
- Course duration: 30 calendar days.
- Remaining course days: 20.

Then:

```text
Refund = 30,000 × 20 / 30

Refund = ₹20,000
```

### Additional Features

- Calculate refund amount.
- Retrieve successful payment amounts for the student.
- Calculate a processing deadline.
- Maintain refund records.
- Track refund status.

The current implementation calculates the processing deadline as 10 days after the withdrawal date.

**Note:** The refund formula and processing deadline are demonstration assumptions, not a confirmed institute-specific refund policy.

---

## 4.7 Student Risk Monitoring

The Risk Monitoring module helps the Accounts Executive identify students who may require additional attention.

The current implementation uses a rule-based scoring system based on payment delays, attendance and academic performance.

### Risk Assessment Criteria

| Indicator | Score |
|---|---:|
| Installment overdue by more than 30 days | +35 |
| Attendance below 60% | +30 |
| Declining performance in the last three test scores | +25 |
| Two or more overdue installments | +10 |

### Risk Classification

| Risk Score | Risk Level |
|---|---|
| Below 30 | Low |
| 30–59 | Medium |
| 60 or above | High |

### Features

**Student Assessment**
- Assess individual students.
- Calculate a risk score.
- Determine the risk level.
- Store the reasons contributing to the score.

**Assessment Results**
- View previous risk assessments.
- Review student risk levels.
- Understand why a student was flagged.

**Counsellor Follow-up Tasks**
- Automatically create a counsellor call task for high-risk students.
- Display open follow-up tasks.
- Track task completion.

**False Positive Handling**
- Allow the Accounts Executive to mark an assessment as a false positive.
- Preserve the assessment record for reference.

### Risk Assessment Workflow

```text
Student information
        |
        v
Check overdue installments
        |
        v
Check attendance percentage
        |
        v
Evaluate recent test scores
        |
        v
Calculate risk score
        |
        v
Assign risk level
        |
        v
If HIGH risk
        |
        v
Create counsellor follow-up task
        |
        v
Accounts Executive tracks task
```

The risk engine is rule-based and does not use a trained machine learning model. Its purpose is to assist the institute in identifying students who may need follow-up.

---

## 4.8 Parent Portal

The Parent Portal provides parents with a dedicated interface to access their linked students' fee information.

It is separate from the Accounts Executive portal.

### Features

**Student Information**
- View linked student records.
- View student names and IDs.

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

**Notifications**
- View generated fee reminders.
- Check reminder type and status.
- View reminder details and scheduled dates.

**Mock Payments**
- Select an installment.
- Enter the payment amount.
- Simulate successful or failed payments.
- View updated fee information after successful payments.

### Parent Access Restrictions

Parents cannot:
- Create or modify fee plans.
- Create student records.
- Manage institute centres or batches.
- Access other parents' student information.
- Access accounts executive management features.

The backend enforces parent-specific access through role-based permissions and student ownership filtering.

---

# 5. System Architecture

EduLedger follows a client-server architecture.

```text
                 USERS
                   |
          -------------------
          |                 |
     Accounts Executive    Parent
          |                 |
          v                 v
       Accounts          Parent Portal
       Dashboard
          |                 |
          --------- ---------
                   |
             React Frontend
                   |
               Axios API
                   |
            Django REST API
                   |
        Authentication & Permissions
                   |
      -------------------------------
      |       |       |       |      |
   Accounts Students Fees  Payments Risk
      |       |       |       |      |
      -------------------------------
                   |
             PostgreSQL
                   |
       ------------------------
       |          |           |
    Reminders   Refunds   Dashboard
```

### Request and Authentication Flow

1. The user opens the React application.
2. The user enters their username and password.
3. React sends the credentials to the Django authentication endpoint.
4. Django validates the credentials.
5. JWT access and refresh tokens are returned.
6. The frontend stores the tokens.
7. Axios attaches the access token to authenticated requests.
8. Django validates the token and checks the user's role.
9. The requested operation is performed.
10. PostgreSQL stores or retrieves the relevant information.
11. The backend returns the response.
12. React updates the user interface.

---

# 6. Database Design

EduLedger uses PostgreSQL as its relational database.

The main database models are:

| Model | Responsibility |
|---|---|
| User | Stores parent and accounts executive accounts |
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

---

# 7. Project Folder Structure

```text
EduLedger/
│
├── backend/
│   ├── config/
│   │
│   ├── accounts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── permissions.py
│   │
│   ├── students/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── management/
│   │
│   ├── fees/
│   ├── payments/
│   ├── reminders/
│   ├── refunds/
│   ├── risk/
│   ├── dashboard/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
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
├── docs/
│
├── README.md
└── deployment.md
```

---

# 8. API Endpoints

All API endpoints use `/api/` as their base path.

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/token/` | Obtain JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Retrieve logged-in user details |
| GET | `/api/auth/parents/` | List parent accounts |
| POST | `/api/auth/parents/` | Create a parent account |

## Account Management – Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/` | Retrieve accessible students |
| POST | `/api/students/` | Create a student |

## Account Management – Centres

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/centres/` | Retrieve centres |
| POST | `/api/students/centres/` | Create a centre |

## Account Management – Batches

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/batches/` | Retrieve batches |
| POST | `/api/students/batches/` | Create a batch |

## Fee Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fees/plans/` | Retrieve fee plans |
| POST | `/api/fees/plans/` | Create a fee plan |
| GET | `/api/fees/ledger/<student_id>/` | Retrieve a student's fee ledger |

## Payment Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/mock/` | Process a simulated payment |

## Reminder Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reminders/` | Retrieve accessible reminders |
| POST | `/api/reminders/generate/` | Generate reminder records |

## Refund Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/refunds/` | Retrieve refund records |
| POST | `/api/refunds/calculate/` | Calculate a refund |

## Risk Monitoring

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/risk/assess/<student_id>/` | Assess a student's risk |
| GET | `/api/risk/assessments/` | Retrieve risk assessments |
| POST | `/api/risk/false-positive/<assessment_id>/` | Mark an assessment as a false positive |
| GET | `/api/risk/tasks/` | Retrieve counsellor tasks |
| PATCH | `/api/risk/tasks/<task_id>/` | Update a counsellor task, if supported by the configured view |

## Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/` | Retrieve dashboard statistics |

**Note:** API permissions are enforced by the backend. The endpoint list describes the application's configured routes; allowed operations and response fields depend on the corresponding views and serializers.

---

# 9. Installation and Setup

## Prerequisites

Install:

- Python.
- Node.js and npm.
- PostgreSQL.
- Git.

## Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
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

```bash
venv\Scripts\activate
```

Install Python dependencies:

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
```

Use the exact variable names expected by your Django settings.

Create the PostgreSQL database:

```sql
CREATE DATABASE eduledger;
```

## Step 4: Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Create Demo Accounts

```bash
python manage.py create_demo_accounts
```

The command creates or updates the Accounts Executive and Parent demo accounts.

## Step 6: Link the Demo Parent

If the demo student already exists, run:

```bash
python manage.py link_demo_parent
```

Ensure that the student ID in the command matches the student record you intend to use for the demo.

## Step 7: Start Django

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

## Step 8: Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start React:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

---

# 10. Demo Login Credentials

The following accounts are provided for project evaluation.

| Role | Username | Password |
|---|---|---|
| Accounts Executive | `admin_demo` | `Admin@12345` |
| Parent | `parent_aarav` | `Parent@123` |

### Accounts Executive Access

The Accounts Executive can access:
- Dashboard.
- Account Management.
- Parents.
- Students.
- Centres.
- Batches.
- Fee Management.
- Payments.
- Reminders.
- Refund Management.
- Risk Monitoring.

### Parent Access

The Parent can access:
- Linked student information.
- Fee summaries.
- Installment details.
- Outstanding balances.
- Payment reminders.
- Simulated payments.

The demo parent account must have a linked student and an associated fee plan to display meaningful information.

**Security:** These are public demonstration credentials. Use only dummy data with these accounts. Do not reuse their passwords for real accounts.

---

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

The parent portal is restricted to the authenticated parent's associated student records.

The Accounts Executive portal contains the institute management features and is protected by accounts-specific permissions.

---

# 12. Current Implementation Scope and Limitations

Some integrations are intentionally simulated for the demonstration.

| Feature | Current implementation |
|---|---|
| Authentication | JWT-based authentication |
| Payments | Mock payment workflow |
| Payment receipts | Database receipt records |
| Reminders | Database reminder generation |
| SMS/WhatsApp | Not integrated |
| Email delivery | Not integrated |
| Risk assessment | Rule-based scoring |
| Refund calculation | Pro-rata calendar-day assumption |
| Database | PostgreSQL |

### Important Assumptions

1. Mock payments demonstrate payment processing without an external payment gateway.
2. Reminder generation creates database records but does not send actual messages.
3. The risk assessment system uses predefined rules rather than a trained AI model.
4. Refund calculations use an assumed pro-rata calendar-day policy.
5. High-risk assessments generate counsellor follow-up tasks rather than automatically making calls.

---

# 13. Future Enhancements

Potential improvements include:

- Integration with Razorpay or another payment gateway.
- Actual SMS, WhatsApp and email reminder delivery.
- Downloadable PDF receipts.
- Detailed financial reports.
- Advanced centre-wise and batch-wise analytics.
- Configurable refund policies.
- Improved audit logs.
- Notification read/unread functionality.
- Automated scheduled reminder execution.
- Machine-learning-based student risk prediction.
- Database backups and production monitoring.

---

# 14. Project Objective

EduLedger brings the major fee management and student monitoring workflows of a coaching institute into one centralized platform.

The Accounts Executive can manage parents, students, centres, batches, fee plans, payments, reminders, refunds and risk assessments.

Parents receive a dedicated portal to view their children's fee information, monitor outstanding amounts and make simulated payments.

The system aims to improve operational organization, fee transparency and communication between coaching institutes and parents.

---

**Built using React.js, Python, Django REST Framework and PostgreSQL.**