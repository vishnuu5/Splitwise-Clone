# Splitwise Clone

A simplified version of Splitwise built with FastAPI (Python) backend and React frontend. This application helps people track shared expenses and figure out who owes whom.

## 📽️ Demo Video

▶️ [Click here to watch the demo](https://github.com/user-attachments/assets/932e3d5e-aeb1-42e6-a3a1-cf39aed65e2c)


## Features

### Backend (FastAPI + PostgreSQL)
- **Group Management**: Create groups with multiple users
- **Expense Management**: Add expenses with equal or percentage-based splits
- **Balance Tracking**: Calculate who owes whom in each group
- **User Management**: Create and manage users
- **RESTful API**: Clean API endpoints with automatic documentation

### Frontend (React + TailwindCSS)
- **Responsive UI**: Clean, modern interface built with TailwindCSS
- **Group Management**: Create and view groups
- **Expense Tracking**: Add expenses and view expense history
- **Balance Overview**: See group balances and personal balance summaries
- **Real-time Updates**: Dynamic updates when adding expenses

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

**Project Strcture**
```bash
Backend
Frontend
docker-compose.yml
```

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/vishnuu5/Splitwise-Clone.git
cd splitwise-clone
```

2. **Start the application with Docker Compose**
```bash
docker-compose up --build
```

This single command will:
- Start PostgreSQL database
- Build and run the FastAPI backend
- Build and run the React frontend
- Set up all necessary dependencies

3. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup (Alternative)

If you prefer to run without Docker:

#### Backend Setup
```bash
cd backend
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### 📋 Core Endpoints

#### **👥 Users**
POST   /users/                    # Create user
GET    /users/                    # List all users
GET    /users/{user_id}           # Get specific user
PUT    /users/{user_id}           # Update user
DELETE /users/{user_id}           # Delete user
GET    /users/{user_id}/balances  # Get user's balances across all groups

### Core Endpoints

#### Users
- `POST /users/` - Create a new user
- `GET /users/` - Get all users
- `GET /users/{user_id}/balances` - Get user's balances across all groups

#### Groups
- `POST /groups/` - Create a new group
- `GET /groups/` - Get all groups
- `GET /groups/{group_id}` - Get group details
- `GET /groups/{group_id}/balances` - Get group balances

#### Expenses
- `POST /groups/{group_id}/expenses/` - Add expense to group
- `GET /groups/{group_id}/expenses/` - Get group expenses

### API Request Examples

#### Create User
```bash
curl POST "http://localhost:8000/users/"
  -H "Content-Type: application/json"
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

#### Create Group
```bash
curl POST "http://localhost:8000/groups/"
  -H "Content-Type: application/json"
  -d '{"name": "Weekend Trip", "user_ids": [1, 2, 3]}'
```

#### Add Expense (Equal Split)
```bash
curl POST "http://localhost:8000/groups/1/expenses/"
  -H "Content-Type: application/json"
  -d '{
    "description": "Dinner",
    "amount": 60.00,
    "paid_by": 1,
    "split_type": "equal",
    "splits": []
  }'
```

#### Add Expense (Percentage Split)
```bash
curl POST "http://localhost:8000/groups/1/expenses/"
  -H "Content-Type: application/json"
  -d '{
    "description": "Hotel",
    "amount": 200.00,
    "paid_by": 1,
    "split_type": "percentage",
    "splits": [
      {"user_id": 1, "percentage": 50},
      {"user_id": 2, "percentage": 30},
      {"user_id": 3, "percentage": 20}
    ]
  }'
```

## Usage Guide

### 1. Create Users
- Navigate to the Users page
- Click "Add User" and fill in name and email
- Create all users who will participate in expense sharing

### 2. Create a Group
- Go to Groups page and click "Create Group"
- Enter group name and select members
- Click "Create Group"

### 3. Add Expenses
- Open a group and click "Add Expense"
- Fill in expense details:
  - Description (e.g., "Dinner", "Hotel")
  - Amount
  - Who paid
  - Split type (Equal or Percentage)
- For percentage splits, specify each person's percentage

### 4. View Balances
- Group balances show who owes whom within the group
- Personal balances show all amounts owed across all groups
- Balances are automatically calculated and updated


## Database Schema

### Tables
- **users**: User information (id, name, email)
- **groups**: Group information (id, name)
- **group_members**: Many-to-many relationship between users and groups
- **expenses**: Expense records (id, description, amount, paid_by, split_type)
- **expense_splits**: Individual splits for each expense

## Assumptions Made

1. **No Authentication**: The application doesn't include user authentication for simplicity
2. **No Payment Processing**: Only tracks balances, doesn't handle actual payments
3. **Simple User Management**: Users are created manually, no registration flow
4. **Equal Split Default**: When split type is "equal", all group members are included
5. **Percentage Validation**: Frontend validates that percentages add up to 100%
6. **Currency**: All amounts are in USD with 2 decimal places

## Development

### Adding New Features
1. **Backend**: Add new endpoints in `main.py`, update models in `models.py`, add schemas in `schemas.py`
2. **Frontend**: Create new components in `src/components/` or pages in `src/pages/`
3. **Database**: Modify models and create migrations using Alembic

### Testing
- Backend: Add tests using pytest
- Frontend: Add tests using Vitest or Jest
- Integration: Test API endpoints with the frontend

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL environment variable

2. **Frontend API Calls Failing**
   - Verify backend is running on port 8000
   - Check CORS settings in FastAPI

3. **Docker Issues**
   - Run `docker-compose down` and `docker-compose up --build`
   - Check Docker logs: `docker-compose logs`

### Logs
- Backend logs: `docker-compose logs backend`
- Frontend logs: `docker-compose logs frontend`
- Database logs: `docker-compose logs postgres`


## License

This project is open source and available under the MIT License.


**docker-compose.yml**
```bash
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: splitwise
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/splitwise
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000

volumes:
  postgres_data:
```

**frontend/Dockerfile**
```bash
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**Backend/Dockerfile**
```bash
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```





