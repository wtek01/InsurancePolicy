# Insurance Policy Management System

A comprehensive application for managing insurance policies. This project consists of a Spring Boot backend, React frontend, and PostgreSQL database.

## Project Structure

- `insurance-policy-backend/`: Spring Boot application that provides the REST API
- `insurance-policy-frontend/`: React application with TypeScript and Vite
- `docker-compose.yml`: Docker Compose configuration to run all services

## Tech Stack

### Frontend

- **React**: JavaScript library for building user interfaces
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Vite**: Next-generation frontend build tool
- **React Router**: For application routing and navigation
- **Axios**: Promise-based HTTP client for making API requests
- **CSS**: Custom styling with responsive design

### Backend

- **Spring Boot**: Framework for building production-ready applications
- **Spring Data JPA**: Simplifies data access using JPA
- **Spring MVC**: For building RESTful APIs
- **Hibernate**: ORM for database interactions
- **PostgreSQL**: Relational database for production
- **H2 Database**: In-memory database for development
- **Lombok**: For reducing boilerplate code
- **Java 17**: Latest LTS version of Java

### DevOps & Tools

- **Docker & Docker Compose**: For containerization and orchestration
- **Git**: Version control
- **Maven**: Build automation and dependency management for backend
- **npm**: Package manager for frontend dependencies
- **RESTful API**: For communication between frontend and backend

## Features

- View, create, update, and delete insurance policies
- User-friendly interface with responsive design
- RESTful API with data validation
- PostgreSQL database for persistent storage

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)
- Java 17 and Maven (for local development)

## Quick Start with Docker

To run the entire application stack using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/yourusername/insurance-policy-manager.git
cd insurance-policy-manager

# Start all services
docker-compose up
```

Once the services are up and running:

- Frontend: http://localhost
- Backend API: http://localhost:8081/api
- Database: PostgreSQL running on port 5432

- Build and start the backend api : http://localhost:8081/api
- Build and start the frontend : http://localhost
- Start a PostgreSQL database running on port 5432

## Development Setup

### Backend (Spring Boot)

```bash
cd insurance-policy-backend
mvn spring-boot:run
```

The backend will start with an H2 in-memory database in development mode.

- API will be available at: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:insurance_db`
  - Username: `sa`
  - Password: (empty)

### Frontend (React)

```bash
cd insurance-policy-frontend
npm install
npm run dev
```

The development server will start on http://localhost:5173

## API Endpoints

### Policies

- `GET /api/policies` - Get all policies
- `GET /api/policies/{id}` - Get policy by ID
- `POST /api/policies` - Create a new policy
- `PUT /api/policies/{id}` - Update a policy
- `DELETE /api/policies/{id}` - Delete a policy

## Configuration

### Environment Variables

The application can be configured using environment variables:

#### Backend

- `SPRING_PROFILES_ACTIVE`: Set to `dev` for development, `prod` for production
- `SPRING_DATASOURCE_URL`: JDBC URL for the database
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

#### Frontend

- `VITE_API_BASE_URL`: URL of the backend API

## Troubleshooting

### Common Issues

- If the frontend shows a blank page, check browser console for errors
- If API calls fail, ensure the backend is running and CORS is properly configured
- For database connection issues, verify PostgreSQL is running and credentials are correct

## License

This project is licensed under the MIT License - see the LICENSE file for details.
