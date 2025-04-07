# Insurance Policy Manager

A Spring Boot application for managing insurance policies with a React frontend.

## Requirements

- Java 17
- Maven 3.x
- Node.js 16+ and npm
- Docker and Docker Compose (for containerized setup)

## Project Structure

- `/` - Spring Boot backend
- `/insurance-policy-frontend` - React frontend

## Running Locally

### Backend

#### 1. Clone the repository

```bash
git clone <repository-url>
cd insurance-policy-manager
```

#### 2. Build the application

```bash
mvn clean install
```

#### 3. Run the application

```bash
mvn spring-boot:run
```

The backend will start with an H2 in-memory database in development mode.

- API will be available at: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:insurance_db`
  - Username: `sa`
  - Password: (empty)

### Frontend

#### 1. Navigate to the frontend directory

```bash
cd insurance-policy-frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Run the development server

```bash
npm run dev
```

The frontend will be available at http://localhost:5173 by default.

## Running with Docker

### Build and run using Docker Compose

```bash
docker-compose up -d
```

This will:

- Build and start the backend application
- Build and start the frontend application
- Start a PostgreSQL database
- Make the application available at http://localhost

### Stop the Docker containers

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

## Docker Configuration

The application uses:

- Frontend on port 80
- Backend Spring Boot with port 8081 in Docker environment
- PostgreSQL database:
  - Database: `insurance_db`
  - Username: `admin`
  - Password: `secret`
  - Port: 5432

## API Documentation

Swagger UI is available at:

- Local: http://localhost:8080/swagger-ui.html
- Docker: http://localhost:8081/swagger-ui.html
