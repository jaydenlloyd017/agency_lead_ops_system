# Agency Lead Operations System

A full-stack lead management CRM built with React, TypeScript, FastAPI and PostgreSQL.

The application is designed to manage incoming sales leads, automatically assign them to active sales representatives, control access based on user roles, and track each lead through a defined sales pipeline.

---

## Features

- JWT-based authentication
- Password hashing
- Role-based access control for admins and sales representatives
- Lead creation and management
- Automatic round-robin lead assignment
- Controlled sales pipeline transitions
- Lead status history / audit trail
- PostgreSQL database with SQLAlchemy ORM
- REST API built with FastAPI
- React and TypeScript frontend
- Filterable lead dashboard
- Human-readable sales rep assignments
- Admin-only user creation
- Protected lead access based on assigned representative

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- Passlib / bcrypt

### Database

- PostgreSQL

### Development

- Git
- GitHub
- REST APIs

---

## Architecture

```text
React + TypeScript Frontend
          |
          | HTTP / REST API
          v
    FastAPI Backend
          |
          | SQLAlchemy ORM
          v
      PostgreSQL
```

Authentication is handled using JWT tokens.

After a successful login, protected requests include the user's bearer token so the backend can identify the current user and enforce permissions.

---

## Role-Based Access Control

The application supports two user roles.

### Admin

Admins can:

- View all leads
- Create new leads
- Create new users
- View lead details
- Update lead statuses
- View lead status history

### Sales Representative

Sales representatives can:

- View leads assigned to their account
- View the details of their assigned leads
- Update their assigned leads through valid pipeline transitions
- View the status history of their assigned leads

A sales representative cannot access a lead assigned to another representative.

---

## Round-Robin Lead Assignment

New leads are automatically distributed between active sales representatives.

The backend:

1. Retrieves all active users with the sales representative role.
2. Finds the representative assigned to the most recently created lead.
3. Finds that representative's position in the active rep list.
4. Moves to the next representative.
5. Uses modulo logic to return to the first representative after reaching the end of the list.
6. Stores the selected user's ID as the lead's `assigned_to` foreign key.

Example:

```text
Lead 1 → Rep A
Lead 2 → Rep B
Lead 3 → Rep C
Lead 4 → Rep A
Lead 5 → Rep B
```

This removes the need for administrators to manually distribute each new lead.

---

## Sales Pipeline

Leads move through a controlled workflow.

```text
New
 ↓
Contacted
 ↓
Qualified
 ↓
Booked
 ↙       ↘
Closed Won   Closed Lost
```

The backend validates allowed status transitions before updating a lead.

Current transition rules include:

```text
New → Contacted

Contacted → Qualified
Contacted → Closed Lost

Qualified → Booked
Qualified → Closed Lost

Booked → Closed Won
Booked → Closed Lost
```

`Closed Won` and `Closed Lost` are terminal states.

---

## Status History

Every lead status change is recorded in a separate history table.

Each history entry stores information including:

- Lead ID
- Previous status
- New status
- Time of the change
- User responsible for the change

This creates an audit trail showing how a lead has moved through the pipeline.

Example:

```text
New → Contacted
Contacted → Qualified
Qualified → Booked
Booked → Closed Won
```

---

## Authentication

Users log in using their email address and password.

Passwords are hashed before being stored in the database.

After successful authentication, the backend creates a JWT access token.

The frontend includes the token in protected API requests:

```text
Authorization: Bearer <token>
```

The backend decodes the token to identify the authenticated user and determine their role.

---

## Lead Management

Admins can create leads using the frontend application.

Each lead can contain:

- Full name
- Email
- Phone number
- Source
- Current status
- Assigned sales representative
- Creation timestamp

When a new lead is created, the round-robin logic automatically assigns it to an active sales representative.

---

## Frontend

The frontend is built using React and TypeScript.

Main screens include:

- Login
- Leads Dashboard
- Create Lead
- Create User
- Lead Details
- Status History

The interface uses a consistent dashboard-style design with:

- Reusable React components
- Status badges
- Filterable lead views
- Human-readable assigned representative names
- Role-based rendering
- Card-based layouts

---

## Screenshots

### Login

![Login page](screenshots/login.png)

### Leads Dashboard

![Leads dashboard](screenshots/dashboard.png)

### Create Lead

![Create lead page](screenshots/create_lead.png)

### Create User

![Create user page](screenshots/create_user.png)

### Lead Details and Status History

![Lead status history](screenshots/view_history.png)

---

## Project Structure

```text
agency_lead_ops_system/
│
├── backend/
│   ├── routers/
│   │   ├── auth.py
│   │   └── leads.py
│   │
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.tsx
│   │   │   ├── HistoryTimeline.tsx
│   │   │   ├── LeadsTable.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatusDropdown.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Leads.tsx
│   │   │   ├── CreateLead.tsx
│   │   │   ├── CreateUser.tsx
│   │   │   └── LeadDetail.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── ...
│
├── screenshots/
├── .gitignore
└── README.md
```

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <https://github.com/jaydenlloyd017/agency_lead_ops_system>
cd agency_lead_ops_system
```

### 2. Create a Python virtual environment

```bash
python3 -m venv backend/venv
```

Activate it:

```bash
source backend/venv/bin/activate
```

### 3. Install backend dependencies

If a backend requirements file is present:

```bash
pip install -r backend/requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost/agency_leads
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

Do not commit the `.env` file to source control.

### 5. Create the PostgreSQL database

```bash
createdb agency_leads
```

Create the application tables:

```bash
python3 -c "from backend.database import engine, Base; import backend.models; Base.metadata.create_all(bind=engine)"
```

### 6. Start the FastAPI backend

```bash
python3 -m uvicorn backend.main:app --reload
```

The backend will normally run at:

```text
http://localhost:8000
```

FastAPI interactive documentation is available at:

```text
http://localhost:8000/docs
```

### 7. Start the React frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

## Security

The project uses several security measures including:

- Hashed passwords
- JWT authentication
- Protected API endpoints
- Role-based access control
- Restricted access to assigned leads

Local configuration and generated files are excluded from version control using `.gitignore`.

This includes:

```text
.env
venv/
__pycache__/
*.pyc
*.db
node_modules/
```

A production version of the application would require additional hardening around areas such as:

- Token storage
- Secret management
- Database permissions
- HTTPS
- Logging
- Monitoring
- Rate limiting

---

## Git and Version Control

The project was developed iteratively using Git and GitHub.

The commit history documents the progression of the application through areas such as:

- Database setup
- Lead CRUD functionality
- Status history
- Authentication
- JWT validation
- Role-based access control
- Frontend development
- Round-robin assignment
- Frontend/backend bug fixes
- UI improvements
- Repository security cleanup

---

## What I Learned

This project was originally created to develop my understanding of backend development and APIs after initially working mainly with frontend technologies.

Through the project I gained practical experience with:

- Designing REST API endpoints
- Connecting a React frontend to a Python backend
- PostgreSQL databases
- SQLAlchemy ORM
- Relational database design
- Foreign keys
- JWT authentication
- Password hashing
- Role-based access control
- Backend validation
- Business logic
- Automatic assignment algorithms
- Frontend/backend integration
- Debugging API issues
- Status-based workflows
- Audit trails
- Git and GitHub
- Environment variables
- Source-control security
- Iterative software development

One of the most useful parts of the project was learning how separate areas of a full-stack application interact rather than treating the frontend, backend and database as isolated systems.

---

## Future Improvements

Potential future improvements include:

- Automated backend tests
- Frontend tests
- GitHub Actions continuous integration
- Automated deployment
- Search functionality
- More advanced filtering
- Lead pagination
- Admin user management
- User deactivation
- Manual lead reassignment
- Improved audit information
- Production deployment
- Improved API error handling
- Monitoring and logging

---

## Author

**Jayden Lloyd**

T-Level Digital Software Development student interested in software engineering, backend development and full-stack applications.
