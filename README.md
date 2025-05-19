# Garbage Collection Company Directory

A full-stack web application for finding and managing garbage collection companies.

## Features

- User authentication with JWT
- Company listings with detailed profiles
- Search and filter companies by region and service
- Full CRUD operations for companies
- Responsive UI with dark mode

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Flask
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- SQLite database
- Flask-Migrate for database migrations
- Flask-CORS for handling cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- pip

### Installation

1. Clone the repository

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up the database
```bash
cd backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Seed the database with initial data
```bash
# Visit this endpoint in your browser or with curl
# http://localhost:5000/api/health/seed
```

### Running the Application

1. Start the backend server
```bash
cd backend
flask run
```

2. Start the frontend development server
```bash
npm run dev
```

3. Or run both concurrently
```bash
npm run dev:all
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user info

### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get a specific company
- `POST /api/companies` - Create a new company (protected)
- `PUT /api/companies/:id` - Update a company (protected)
- `DELETE /api/companies/:id` - Delete a company (protected)

### Regions
- `GET /api/regions` - List all regions
- `GET /api/regions/:id` - Get a specific region
- `POST /api/regions` - Create a new region (protected)

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get a specific service
- `POST /api/services` - Create a new service (protected)

### Health
- `GET /api/health` - Check API status
- `GET /api/health/seed` - Seed database with initial data

## License

This project is licensed under the MIT License - see the LICENSE file for details.