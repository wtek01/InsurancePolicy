# Pagination Implementation in Insurance Policy Manager

This document provides a detailed explanation of how pagination is implemented across the Insurance Policy Manager application, covering both backend and frontend components.

## Table of Contents

1. [Overview](#overview)
2. [Centralized Configuration](#centralized-configuration)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Request-Response Flow](#request-response-flow)
6. [Best Practices](#best-practices)

## Overview

Pagination in the Insurance Policy Manager is designed to efficiently handle large datasets by:

- Loading only a subset of data at a time
- Providing user controls for navigating through pages
- Supporting dynamic sorting of data
- Ensuring consistent behavior between frontend and backend

The system follows a client-server model where:

- The frontend requests specific pages with sorting preferences
- The backend processes these requests and returns only the requested page
- The frontend displays the data with navigation controls

## Centralized Configuration

To ensure consistency, pagination defaults are centralized in both frontend and backend components:

### Backend Configuration (`PaginationConfig.java`)

```java
public class PaginationConfig {
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 5;
    public static final String DEFAULT_SORT_FIELD = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";
}
```

### Frontend Configuration (`paginationConfig.ts`)

```typescript
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_SORT_FIELD = "id";
export const DEFAULT_SORT_DIRECTION = "asc";
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
```

This dual configuration ensures that both sides of the application have consistent default behavior while allowing each to be modified independently if necessary.

## Backend Implementation

The backend pagination implementation consists of several key components:

### 1. Data Transfer Object

The `PagedResponse.java` class is a generic DTO that encapsulates paginated data and metadata:

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagedResponse<T> {
    private List<T> content;       // The items for the current page
    private int page;              // Current page number (0-based)
    private int size;              // Page size
    private long totalElements;    // Total number of items across all pages
    private int totalPages;        // Total number of pages
    private boolean last;          // Whether this is the last page
}
```

### 2. Controller Layer

The REST controller exposes an endpoint for paginated policy retrieval, accepting query parameters for pagination and sorting:

```java
@GetMapping("/paged")
public ResponseEntity<PagedResponse<InsurancePolicyDTO>> getPoliciesPaginated(
        @RequestParam(value = "page", defaultValue = ""+PaginationConfig.DEFAULT_PAGE) int page,
        @RequestParam(value = "size", defaultValue = ""+PaginationConfig.DEFAULT_PAGE_SIZE) int size,
        @RequestParam(value = "sort", defaultValue = PaginationConfig.DEFAULT_SORT_FIELD) String sort,
        @RequestParam(value = "direction", defaultValue = PaginationConfig.DEFAULT_SORT_DIRECTION) String direction) {

    PagedResponse<InsurancePolicyDTO> pagedResponse = policyService.getPoliciesPaginated(page, size, sort, direction);
    return ResponseEntity.ok(pagedResponse);
}
```

This method:

- Accepts four query parameters with default values from the configuration
- Delegates the pagination logic to the service layer
- Returns an HTTP 200 response with the paged data

### 3. Service Layer

The service layer contains the core pagination logic:

```java
public PagedResponse<InsurancePolicyDTO> getPoliciesPaginated(int page, int size, String sortBy, String direction) {
    // Create a Sort object based on the requested field and direction
    Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
            Sort.by(sortBy).ascending() :
            Sort.by(sortBy).descending();

    // Create a Pageable object with the requested page, size, and sort criteria
    Pageable pageable = PageRequest.of(page, size, sort);

    // Get a page of data from the repository
    Page<InsurancePolicy> policiesPage = policyRepository.findAll(pageable);

    // Convert entity objects to DTOs
    List<InsurancePolicyDTO> content = policiesPage.getContent().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

    // Build and return the paged response
    return PagedResponse.<InsurancePolicyDTO>builder()
            .content(content)
            .page(policiesPage.getNumber())
            .size(policiesPage.getSize())
            .totalElements(policiesPage.getTotalElements())
            .totalPages(policiesPage.getTotalPages())
            .last(policiesPage.isLast())
            .build();
}
```

This method:

1. Creates a `Sort` object based on the requested sort field and direction
2. Creates a `Pageable` object using Spring Data's `PageRequest`
3. Uses Spring Data JPA's pagination capabilities to fetch only the requested page
4. Maps entity objects to DTOs
5. Creates a `PagedResponse` with both the data and pagination metadata

### 4. Repository Layer

The repository layer leverages Spring Data JPA's built-in pagination support:

```java
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    // Spring Data JPA automatically provides paged queries via the findAll(Pageable) method
}
```

Spring Data JPA translates the `Pageable` object into a SQL query with appropriate `LIMIT` and `OFFSET` clauses, ensuring database efficiency.

## Frontend Implementation

The frontend pagination implementation consists of several interconnected components:

### 1. API Service

The API service in `insuranceApiService.ts` provides a method to fetch paginated data:

```typescript
getPaginated: async (
  page: number = DEFAULT_PAGE,
  size: number = DEFAULT_PAGE_SIZE,
  sort: string = DEFAULT_SORT_FIELD,
  direction: string = DEFAULT_SORT_DIRECTION
): Promise<PagedResponse<Policy>> => {
  const response = await apiInstance.get<PagedResponse<Policy>>(
    "/policies/paged",
    {
      params: { page, size, sort, direction },
    }
  );
  return response.data;
};
```

This method:

- Takes pagination parameters with defaults from the configuration
- Sends these parameters as query parameters to the backend API
- Returns the typed response data

### 2. Component State

The `Policies` component maintains pagination state using React hooks:

```typescript
// Pagination state variables
const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
const [totalPages, setTotalPages] = useState(0);
const [totalElements, setTotalElements] = useState(0);
const [sortField, setSortField] = useState(DEFAULT_SORT_FIELD);
const [sortDirection, setSortDirection] = useState(DEFAULT_SORT_DIRECTION);
```

### 3. Data Fetching

The component fetches data when pagination parameters change:

```typescript
useEffect(() => {
  fetchPolicies();
}, [currentPage, pageSize, sortField, sortDirection]);

const fetchPolicies = async () => {
  try {
    setLoading(true);
    const response = await policyApi.getPaginated(
      currentPage,
      pageSize,
      sortField,
      sortDirection
    );

    if (response && response.content) {
      setPolicies(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setError(null);
    } else {
      console.error("Unexpected response format:", response);
      setError("Failed to load policies. Unexpected response format.");
      setPolicies([]);
    }
  } catch (err) {
    console.error("Error fetching policies:", err);
    setError("Failed to load policies. Please try again later.");
    setPolicies([]);
  } finally {
    setLoading(false);
  }
};
```

This approach:

- Uses React's `useEffect` to trigger data fetching when pagination parameters change
- Updates the component state with both data and pagination metadata
- Handles loading states and error conditions

### 4. User Interface Controls

The component provides UI controls for pagination:

```jsx
<div className="pagination">
  <button onClick={() => handlePageChange(0)} disabled={currentPage === 0}>
    First
  </button>
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 0}
  >
    Previous
  </button>
  <span>
    Page {currentPage + 1} of {totalPages}
    {totalElements > 0 && ` • Total: ${totalElements}`}
  </span>
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage >= totalPages - 1}
  >
    Next
  </button>
  <button
    onClick={() => handlePageChange(totalPages - 1)}
    disabled={currentPage >= totalPages - 1}
  >
    Last
  </button>
  <select
    value={pageSize}
    onChange={(e) => setPageSize(Number(e.target.value))}
    aria-label="Items per page"
    title="Items per page"
  >
    {PAGE_SIZE_OPTIONS.map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>
</div>
```

These controls:

- Provide navigation buttons (first, previous, next, last)
- Display current page information and total counts
- Allow users to change the number of items per page
- Disable buttons when they aren't applicable (e.g., "Previous" on the first page)

### 5. Page Navigation

The component handles page navigation with a simple method:

```typescript
const handlePageChange = (newPage: number) => {
  if (newPage >= 0 && newPage < totalPages) {
    setCurrentPage(newPage);
  }
};
```

### 6. Sorting

The component also handles column sorting:

```typescript
const handleSort = (field: string) => {
  if (field === sortField) {
    // Toggle sort direction if clicking the same field
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    // Set new sort field and default to ascending
    setSortField(field);
    setSortDirection("asc");
  }
};
```

Sorting indicators are shown in the table headers:

```jsx
<th onClick={() => handleSort("policyName")}>
  Policy Name{" "}
  {sortField === "policyName" && (sortDirection === "asc" ? "▲" : "▼")}
</th>
```

## Request-Response Flow

The complete pagination flow works as follows:

1. **Initial Page Load**:

   - The frontend component initializes with default pagination values
   - It calls the API with these defaults (page 0, size 5, sort by id ascending)
   - The backend processes the request, fetching and returning only the first page
   - The frontend displays the data and pagination controls

2. **Page Navigation**:

   - User clicks "Next" button → `currentPage` state updates to 1
   - This triggers a new API call with updated parameters
   - Backend returns page 1 data
   - Frontend updates the display

3. **Changing Page Size**:

   - User selects a new page size (e.g., 10) → `pageSize` state updates
   - This triggers a new API call with the new size
   - Backend returns data with the new page size
   - Frontend updates the display and recalculates pagination controls

4. **Sorting**:

   - User clicks a column header → sorting parameters update
   - This triggers a new API call with the updated sort field and direction
   - Backend sorts the data and returns the first page of sorted results
   - Frontend updates the display

5. **Response Processing**:
   - For each response, the frontend extracts:
     - `content`: The items to display
     - `page`, `size`: Current pagination state
     - `totalElements`, `totalPages`: For calculating pagination controls
     - `last`: To determine if this is the last page

## Best Practices

The pagination implementation follows several best practices:

### Backend

1. **Efficiency**: Only fetches the necessary data from the database
2. **Separation of Concerns**: Controller, service, and repository layers have distinct responsibilities
3. **Generic Response Format**: The `PagedResponse` can be used for any type of data
4. **Default Values**: Sensible defaults are provided for all parameters
5. **Validation**: Input parameters are validated to prevent errors

### Frontend

1. **State Management**: Pagination state is clearly managed with React hooks
2. **Loading States**: Loading indicators during data fetching
3. **Error Handling**: Graceful handling of API errors
4. **Accessible Controls**: Pagination controls follow accessibility best practices
5. **Visual Feedback**: Clear indicators for current page and sorting direction

### Shared

1. **Consistency**: Frontend and backend share the same pagination concepts
2. **Centralization**: Configuration is centralized in dedicated files
3. **Type Safety**: TypeScript and Java types ensure data integrity
4. **Zero-Based Indexing**: Consistent use of zero-based page numbering internally
5. **User-Friendly Display**: Pages shown to users are 1-indexed (page + 1)

By implementing pagination in this way, the Insurance Policy Manager application can efficiently handle datasets of any size while providing a smooth user experience.
