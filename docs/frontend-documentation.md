# Insurance Policy Manager Frontend Documentation

## Application Overview

The Insurance Policy Manager is a React-based single-page application (SPA) designed to manage insurance policies. The application allows users to create, view, update, and delete insurance policies through an intuitive user interface.

## Technology Stack

- **Framework**: React 19.0.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.5.0
- **HTTP Client**: Axios 1.8.4
- **Styling**: CSS (with custom styles)
- **Containerization**: Docker with Nginx for production deployment

## Architecture

The application follows a modular component-based architecture with clear separation of concerns:

```
insurance-policy-frontend/
├── src/
│   ├── api/              # API service modules
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   ├── constants/        # Application constants
│   ├── pages/            # Page components (routes)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.tsx          # Application entry point
```

## Key Components

### Core Components

1. **App.tsx**

   - The main component that defines the application structure
   - Sets up routing with React Router
   - Provides the application layout with header, main content, and footer
   - Uses lazy loading for page components to improve performance

2. **PolicyForm**

   - Reusable form component for creating and editing policies
   - Handles form state, validation, and submission
   - Adapts based on whether creating a new policy or editing an existing one

3. **Button**

   - Customizable button component with different style variants
   - Used throughout the application for consistent UI

4. **Alert**

   - Displays error, warning, or success messages to the user
   - Used for API operation results feedback

5. **Loading**
   - Simple loading indicator for asynchronous operations

### Page Components

1. **Home**

   - Landing page with links to main application features
   - Provides a quick overview and navigation options

2. **Policies**

   - Displays a table of all policies with pagination
   - Allows sorting by different fields
   - Provides links to view, edit, or delete individual policies
   - Handles policy deletion with confirmation

3. **PolicyDetails**

   - Displays detailed information about a specific policy
   - Shows all policy fields in a readable format

4. **CreatePolicy**

   - Form page for creating new policies
   - Uses the PolicyForm component

5. **EditPolicy**
   - Form page for editing existing policies
   - Loads policy data and uses the PolicyForm component

## API Integration

The application communicates with the backend server through a centralized API service (`insuranceApiService.ts`), which:

- Creates a configured Axios instance
- Provides methods for all policy-related API operations
- Handles API URL configuration through environment variables
- Implements proper error handling

### API Methods

- **getAll**: Fetches all policies without pagination
- **getPaginated**: Fetches paginated policy data with sorting options
- **getById**: Fetches a single policy by ID
- **create**: Creates a new policy
- **update**: Updates an existing policy
- **delete**: Deletes a policy by ID

## Data Models

### Policy

The core data model representing an insurance policy:

```typescript
export interface Policy {
  id: number;
  policyName: string;
  status: PolicyStatus;
  coverageStartDate: string;
  coverageEndDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### PolicyStatus

An enum of possible policy statuses:

```typescript
export enum PolicyStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}
```

### API Response Formats

```typescript
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

## Pagination Configuration

Pagination settings are centralized in `paginationConfig.ts` to ensure consistency between frontend and backend:

```typescript
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_SORT_FIELD = "id";
export const DEFAULT_SORT_DIRECTION = "asc";
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
```

## Routing

The application uses React Router for client-side routing with the following routes:

- `/`: Home page
- `/policies`: List of all policies with pagination
- `/policies/:id`: Details of a specific policy
- `/policies/create`: Form to create a new policy
- `/policies/edit/:id`: Form to edit an existing policy

## Features

### Policy Management

- **View Policies**: Display all policies in a sortable, paginated table
- **Create Policy**: Add new policies with name, status, and coverage dates
- **Edit Policy**: Modify existing policy details
- **Delete Policy**: Remove policies with confirmation
- **View Details**: See complete information about a specific policy

### Pagination

- Configurable page size
- Navigation controls (first, previous, next, last)
- Page count information
- Total items count

### Sorting

- Sort by any column in the policy table
- Toggle between ascending and descending order

## State Management

The application uses React's built-in state management with hooks:

- **useState**: For local component state
- **useEffect**: For side effects like API calls

## Environment Configuration

The application supports multiple environment configurations:

- Development environment variables via Vite's `import.meta.env`
- Runtime configuration through `window.ENV` for containerized deployments
- Fallback to localhost for local development

## Deployment

The application can be deployed using Docker:

1. Build the container using the provided Dockerfile
2. Configure environment variables through the `env-config.js` template
3. Use Nginx as a web server for serving the static assets

## Best Practices Implemented

1. **Lazy Loading**: Components are loaded on demand to improve initial load performance
2. **Centralized Configuration**: Pagination and other settings are defined in one place
3. **Type Safety**: TypeScript interfaces for all data models and API responses
4. **Component Reusability**: Form components and UI elements are reused
5. **Responsive Design**: The UI adapts to different screen sizes
6. **Error Handling**: Proper error handling and user feedback
7. **Confirmation Dialogs**: User confirmation for destructive actions
8. **Consistent Styling**: Unified styling approach across the application

## Code Examples

### API Service Structure

```typescript
// From insuranceApiService.ts
import axios from "axios";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
} from "../constants/paginationConfig";
import {
  ApiResponse,
  CreatePolicyRequest,
  PagedResponse,
  Policy,
  UpdatePolicyRequest,
} from "../types";

// Get API base URL from window.ENV or Vite environment or fallback to localhost
const getApiBaseUrl = () => {
  // Check if runtime environment config exists
  if (window.ENV && window.ENV.VITE_API_BASE_URL) {
    return window.ENV.VITE_API_BASE_URL;
  }
  // Fall back to build-time environment variable or default
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
};

// Create axios instance with default config
const apiInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Policy API endpoints
export const policyApi = {
  // API methods...
};
```

### Policy Table Component

```typescript
// Excerpt from Policies.tsx
<table className="table">
  <thead>
    <tr>
      <th onClick={() => handleSort("policyName")}>
        Policy Name{" "}
        {sortField === "policyName" && (sortDirection === "asc" ? "▲" : "▼")}
      </th>
      {/* Other table headers... */}
    </tr>
  </thead>
  <tbody>
    {policies.map((policy) => (
      <tr key={policy.id}>
        <td>{policy.policyName}</td>
        <td>{policy.status}</td>
        <td>{new Date(policy.coverageStartDate).toLocaleDateString()}</td>
        <td>{new Date(policy.coverageEndDate).toLocaleDateString()}</td>
        <td className="action-buttons">{/* Action buttons... */}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Form Component

```typescript
// Excerpt from PolicyForm.tsx
const PolicyForm = ({ policy, onSubmit, isLoading }: PolicyFormProps) => {
  const [formData, setFormData] = useState<CreatePolicyRequest>({
    policyName: "",
    status: PolicyStatus.ACTIVE,
    coverageStartDate: "",
    coverageEndDate: "",
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        policyName: policy.policyName,
        status: policy.status,
        coverageStartDate: policy.coverageStartDate.split("T")[0],
        coverageEndDate: policy.coverageEndDate.split("T")[0],
      });
    }
  }, [policy]);

  // Form handlers...

  return <form onSubmit={handleSubmit}>{/* Form fields... */}</form>;
};
```

## Future Improvements

The Insurance Policy Manager application could be enhanced with the following future improvements:

### UI/UX Enhancements

1. **Dark Mode Support**: Implement theme switching for better accessibility and user preference
2. **Advanced Filtering**: Add more sophisticated filtering options for policies by date ranges, status, etc.
3. **Bulk Operations**: Allow users to select multiple policies for bulk actions (delete, status change)
4. **Responsive Design Improvements**: Enhance mobile experience with touch-friendly controls

### Performance Optimizations

1. **Implement Memoization**: Use React.memo and useMemo for expensive calculations and rendering
2. **Code Splitting**: Further optimize bundle size through additional code splitting
3. **Virtual Scrolling**: Replace standard tables with virtualized lists for better performance with large datasets
4. **State Management**: Consider using React Context API or Zustand for more complex state management needs

### Feature Additions

1. **Policy Templates**: Create reusable templates for common policy types
2. **Export/Import**: Allow exporting policy data to CSV/Excel and importing from external sources
3. **Notifications**: Implement notification system for policy expiration or status changes
4. **Audit Logs**: Track and display history of changes made to policies
5. **User Roles**: Implement role-based access control for different user types (admin, agent, viewer)

### Technical Debt & Maintenance

1. **Test Coverage**: Increase unit and integration test coverage
2. **Storybook Integration**: Document components with Storybook for better developer experience
3. **API Error Handling**: Enhance error handling with more detailed user feedback
4. **Accessibility Audit**: Ensure full WCAG 2.1 compliance through comprehensive accessibility testing

### Infrastructure

1. **CI/CD Pipeline**: Implement automated testing and deployment workflows
2. **Monitoring**: Add application monitoring and error tracking
3. **Performance Metrics**: Track and optimize core web vitals and other performance metrics
