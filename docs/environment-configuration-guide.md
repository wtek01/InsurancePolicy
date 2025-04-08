# Environment Configuration Guide

# Insurance Policy Manager Application

This guide explains how environment variables are configured and used in different environments for the Insurance Policy Manager application.

## Table of Contents

1. [Overview](#overview)
2. [Configuration Files](#configuration-files)
3. [Environment Setup by Context](#environment-setup-by-context)
   - [Local Development](#local-development)
   - [Docker Environment](#docker-environment)
   - [Production Deployment](#production-deployment)
4. [Frontend Environment Variables](#frontend-environment-variables)
5. [Backend Environment Variables](#backend-environment-variables)
6. [Environment Variable Precedence](#environment-variable-precedence)
7. [Adding New Environment Variables](#adding-new-environment-variables)
8. [Troubleshooting](#troubleshooting)

## Overview

The Insurance Policy Manager application uses different methods to configure environment variables depending on the deployment context:

- **Frontend**: Uses a combination of Vite environment variables (for local development) and runtime configuration via `window.ENV` (for Docker/production)
- **Backend**: Uses Spring profiles and environment variable substitution in YAML configuration files

This dual approach enables a smooth development experience while ensuring deployment flexibility across environments.

## Configuration Files

### Frontend Configuration Files

| File                              | Purpose                                       | Environment       |
| --------------------------------- | --------------------------------------------- | ----------------- |
| `.env.local` (not tracked in git) | Local development variables                   | Development       |
| `env-config.js.template`          | Template for Docker runtime configuration     | Docker/Production |
| `env-config.js` (generated)       | Runtime configuration loaded by browser       | Docker/Production |
| `Dockerfile`                      | Contains script to generate `env-config.js`   | Docker/Production |
| `index.html`                      | Loads runtime configuration before app starts | All               |

### Backend Configuration Files

| File                   | Purpose                               | Environment |
| ---------------------- | ------------------------------------- | ----------- |
| `application.yml`      | Default configuration (H2 database)   | Development |
| `application-prod.yml` | Production configuration (PostgreSQL) | Production  |

## Environment Setup by Context

### Local Development

#### Frontend Setup

1. Create a `.env.local` file in the `insurance-policy-frontend` directory:

   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. Start the development server:

   ```bash
   cd insurance-policy-frontend
   npm run dev
   ```

3. Vite will automatically load the environment variables and make them available via `import.meta.env`.

#### Backend Setup

1. No special environment configuration needed
2. The application uses `application.yml` by default with H2 in-memory database
3. Start the backend with:
   ```bash
   cd insurance-policy-backend
   ./mvnw spring-boot:run
   ```

### Docker Environment

#### Docker Compose Setup

Create or update `docker-compose.yml`:

```yaml
version: "3"
services:
  frontend:
    build:
      context: ./insurance-policy-frontend
      args:
        - VITE_API_BASE_URL=http://backend:8080/api # Used during build
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api # Used at runtime
    depends_on:
      - backend

  backend:
    build: ./insurance-policy-backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=insurance_db
      - DB_USER=postgres
      - DB_PASSWORD=postgres
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=insurance_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start with:

```bash
docker-compose up -d
```

### Production Deployment

#### Frontend Deployment

```bash
# Build the image
docker build -t insurance-frontend:prod \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  ./insurance-policy-frontend

# Run the container
docker run -d -p 80:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  insurance-frontend:prod
```

#### Backend Deployment

```bash
# Build the image
docker build -t insurance-backend:prod ./insurance-policy-backend

# Run the container
docker run -d -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=production-db.example.com \
  -e DB_PORT=5432 \
  -e DB_NAME=insurance_prod \
  -e DB_USER=prod_user \
  -e DB_PASSWORD=secure_password \
  insurance-backend:prod
```

## Frontend Environment Variables

### Available Variables

| Variable            | Purpose              | Default                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | URL for API requests | `http://localhost:8080/api` |

### How Variables Are Accessed

The API base URL is determined through a multi-tiered approach in `insuranceApiService.ts`:

```typescript
const getApiBaseUrl = () => {
  // Check if runtime environment config exists
  if (window.ENV && window.ENV.VITE_API_BASE_URL) {
    return window.ENV.VITE_API_BASE_URL;
  }
  // Fall back to build-time environment variable or default
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
};
```

### Runtime Configuration Process

1. The Docker container starts
2. The entrypoint script runs:
   ```bash
   envsubst < /usr/share/nginx/html/env-config.js.template > /usr/share/nginx/html/env-config.js
   ```
3. This creates `env-config.js` with actual environment variable values
4. The browser loads this file before loading the application
5. Environment variables become available via `window.ENV`

## Backend Environment Variables

### Available Variables

| Variable                 | Purpose                         | Default        | Used In          |
| ------------------------ | ------------------------------- | -------------- | ---------------- |
| `SPRING_PROFILES_ACTIVE` | Activates configuration profile | `default`      | All environments |
| `DB_HOST`                | Database hostname               | `localhost`    | Production       |
| `DB_PORT`                | Database port                   | `5432`         | Production       |
| `DB_NAME`                | Database name                   | `insurance_db` | Production       |
| `DB_USER`                | Database username               | None           | Production       |
| `DB_PASSWORD`            | Database password               | None           | Production       |

### Configuration in application-prod.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:insurance_db}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

The format `${VARIABLE_NAME:default_value}` provides a default if the environment variable is not set.

## Environment Variable Precedence

### Frontend Precedence

1. Runtime configuration via `window.ENV` (highest priority)
2. Build-time Vite environment variables via `import.meta.env`
3. Hardcoded defaults in code (lowest priority)

### Backend Precedence

1. Environment variables passed to the container/application
2. Profile-specific properties (e.g., in `application-prod.yml`)
3. Default properties (in `application.yml`)
4. Default values in property placeholders (lowest priority)

## Adding New Environment Variables

### Adding Frontend Variables

1. Add to `env-config.js.template`:

   ```javascript
   window.ENV = {
     VITE_API_BASE_URL: "${VITE_API_BASE_URL}",
     VITE_NEW_VARIABLE: "${VITE_NEW_VARIABLE}",
   };
   ```

2. Update access code in your application:

   ```typescript
   const getNewVariable = () => {
     if (window.ENV && window.ENV.VITE_NEW_VARIABLE) {
       return window.ENV.VITE_NEW_VARIABLE;
     }
     return import.meta.env.VITE_NEW_VARIABLE || "default value";
   };
   ```

3. Add to `.env.local` for local development:

   ```
   VITE_NEW_VARIABLE=local_value
   ```

4. Provide when running Docker:
   ```bash
   docker run -e VITE_NEW_VARIABLE=production_value ...
   ```

### Adding Backend Variables

1. Add to configuration files with defaults:

   ```yaml
   myservice:
     config:
       new-property: ${NEW_VARIABLE:default_value}
   ```

2. Access in your application:

   ```java
   @Value("${myservice.config.new-property}")
   private String newProperty;
   ```

3. Provide when running Docker:
   ```bash
   docker run -e NEW_VARIABLE=production_value ...
   ```

## Troubleshooting

### Frontend Environment Issues

1. **Variables not available in browser:**

   - Check that `env-config.js` is being generated correctly
   - Verify that the script tag in `index.html` is loading before your application
   - Check browser console for any loading errors

2. **Variables not updating when container restarts:**
   - Ensure you're passing the environment variables to the container
   - Check that the `envsubst` command is running in the entrypoint script
   - Clear browser cache or do a hard refresh

### Backend Environment Issues

1. **Database connection failures:**

   - Verify environment variables are correctly passed to the container
   - Check that the database is accessible from the container network
   - Validate credentials

2. **Profile not activating:**
   - Ensure `SPRING_PROFILES_ACTIVE` is set correctly
   - Check logs for profile activation messages at startup

By following this guide, you should be able to manage environment configuration across all deployment contexts for the Insurance Policy Manager application.
