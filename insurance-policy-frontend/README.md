# Insurance Policy Manager Frontend

This is the frontend for the Insurance Policy Manager application, built with React, Vite, and TypeScript.

## Features

- View and manage clients
- View and manage insurance policies
- Associate policies with clients
- Responsive design with pure CSS (no frameworks)

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Axios

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Insurance Policy Manager backend running (Spring Boot application)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173 by default.

### Build for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Configuration

The API URL is configured in `src/api/apiClient.ts`. You can set it using the environment variable:

```
VITE_API_BASE_URL=http://your-api-url
```

By default, it points to `http://localhost:8080/api` if no environment variable is set.

### Environment Variables

| Variable          | Description            | Default                   |
| ----------------- | ---------------------- | ------------------------- |
| VITE_API_BASE_URL | URL of the backend API | http://localhost:8080/api |

## Docker Support

The application includes a Dockerfile for containerization. When running with Docker Compose, the frontend communicates with the backend container.

## Project Structure

```
src/
├── api/           # API client and services
├── components/    # Reusable components
├── pages/         # Page components
├── types/         # TypeScript interfaces and types
├── assets/        # Static assets
├── App.tsx        # Main application component
├── App.css        # Application styles
├── index.css      # Global styles
└── main.tsx       # Application entry point
```

## Integration with Backend

This frontend is designed to work with the Insurance Policy Manager backend. Make sure the backend is running and accessible at the URL configured in `src/api/apiClient.ts`.

## License

This project is open source and available under the [MIT License](LICENSE).
