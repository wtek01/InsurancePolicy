# Insurance Policy Manager Backend Documentation

## Application Overview

The Insurance Policy Manager Backend is a Spring Boot application that provides RESTful API services for managing insurance policies. The application is designed to handle policy creation, retrieval, updating, and deletion with proper validation and error handling.

## Technology Stack

- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**:
  - H2 (in-memory for development)
  - PostgreSQL (for production)
- **ORM**: Hibernate with Spring Data JPA
- **API Documentation**: Springdoc OpenAPI (Swagger UI)
- **Object Mapping**: ModelMapper
- **Validation**: Spring Validation
- **Containerization**: Docker

## Architecture

The application follows a layered architecture with clear separation of concerns:

```
insurance-policy-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/tinubu/insurance/policymanager/
│   │   │       ├── config/          # Configuration classes
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── dto/             # Data Transfer Objects
│   │   │       ├── exception/       # Exception handling
│   │   │       ├── model/           # Entity classes
│   │   │       ├── repository/      # Data access layer
│   │   │       ├── service/         # Business logic
│   │   │       └── InsurancePolicyManagerApplication.java  # Application entry point
│   │   └── resources/
│   │       ├── application.yml      # Application configuration
│   │       └── application-prod.yml # Production configuration
│   └── test/                        # Test classes
```

## Key Components

### Models

The core domain model representing insurance policies:

**InsurancePolicy.java**

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "insurance_policies")
public class InsurancePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Policy name is required")
    @Column(nullable = false)
    private String policyName;

    @NotNull(message = "Policy status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status;

    @NotNull(message = "Coverage start date is required")
    @Column(name = "coverage_start_date", nullable = false)
    private LocalDate coverageStartDate;

    @NotNull(message = "Coverage end date is required")
    @Column(name = "coverage_end_date", nullable = false)
    private LocalDate coverageEndDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    // Custom validation to ensure end date is after start date
    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (coverageEndDate.isBefore(coverageStartDate)) {
            throw new IllegalArgumentException("Coverage end date must be after start date");
        }
    }
}
```

**PolicyStatus.java** - Enum representing the possible statuses of a policy:

```java
public enum PolicyStatus {
    ACTIVE, INACTIVE
}
```

### DTOs (Data Transfer Objects)

DTOs are used to transfer data between the controller and service layers:

**InsurancePolicyDTO.java** - Represents a policy for API operations:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePolicyDTO {
    private Long id;
    private String policyName;
    private PolicyStatus status;
    private LocalDate coverageStartDate;
    private LocalDate coverageEndDate;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
```

**PagedResponse.java** - Used for paginated responses:

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
```

### Repository

The data access layer using Spring Data JPA:

**InsurancePolicyRepository.java**

```java
@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
}
```

### Service

The service layer implements the business logic:

**InsurancePolicyService.java**

```java
@Service
@RequiredArgsConstructor
@Validated
public class InsurancePolicyService {
    private final InsurancePolicyRepository policyRepository;

    // Get all policies (non-paginated)
    public List<InsurancePolicyDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get policies with pagination and sorting
    public PagedResponse<InsurancePolicyDTO> getPoliciesPaginated(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<InsurancePolicy> policiesPage = policyRepository.findAll(pageable);

        List<InsurancePolicyDTO> content = policiesPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return PagedResponse.<InsurancePolicyDTO>builder()
                .content(content)
                .page(policiesPage.getNumber())
                .size(policiesPage.getSize())
                .totalElements(policiesPage.getTotalElements())
                .totalPages(policiesPage.getTotalPages())
                .last(policiesPage.isLast())
                .build();
    }

    // Get a policy by ID
    public InsurancePolicyDTO getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with id: " + id));
        return convertToDTO(policy);
    }

    // Create a new policy
    public InsurancePolicyDTO createPolicy(@Valid InsurancePolicyDTO policyDTO) {
        InsurancePolicy policy = convertToEntity(policyDTO);
        policy.setCreatedAt(LocalDate.now());
        policy.setUpdatedAt(LocalDate.now());
        InsurancePolicy savedPolicy = policyRepository.save(policy);
        return convertToDTO(savedPolicy);
    }

    // Update an existing policy
    public InsurancePolicyDTO updatePolicy(Long id, @Valid InsurancePolicyDTO policyDTO) {
        InsurancePolicy existingPolicy = policyRepository.findById(id)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with id: " + id));

        // Manual mapping of fields
        existingPolicy.setPolicyName(policyDTO.getPolicyName());
        existingPolicy.setStatus(policyDTO.getStatus());
        existingPolicy.setCoverageStartDate(policyDTO.getCoverageStartDate());
        existingPolicy.setCoverageEndDate(policyDTO.getCoverageEndDate());
        existingPolicy.setUpdatedAt(LocalDate.now());

        InsurancePolicy updatedPolicy = policyRepository.save(existingPolicy);
        return convertToDTO(updatedPolicy);
    }

    // Delete a policy
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new PolicyNotFoundException("Policy not found with id: " + id);
        }
        policyRepository.deleteById(id);
    }

    // Helper methods for entity-DTO conversion
    private InsurancePolicyDTO convertToDTO(InsurancePolicy policy) {
        return InsurancePolicyDTO.builder()
                .id(policy.getId())
                .policyName(policy.getPolicyName())
                .status(policy.getStatus())
                .coverageStartDate(policy.getCoverageStartDate())
                .coverageEndDate(policy.getCoverageEndDate())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }

    private InsurancePolicy convertToEntity(InsurancePolicyDTO policyDTO) {
        return InsurancePolicy.builder()
                .policyName(policyDTO.getPolicyName())
                .status(policyDTO.getStatus())
                .coverageStartDate(policyDTO.getCoverageStartDate())
                .coverageEndDate(policyDTO.getCoverageEndDate())
                .build();
    }
}
```

### Controller

The REST controller defines the API endpoints:

**InsurancePolicyController.java**

```java
@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class InsurancePolicyController {

    private final InsurancePolicyService policyService;

    @GetMapping
    public ResponseEntity<List<InsurancePolicyDTO>> getAllPolicies() {
        List<InsurancePolicyDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }

    @GetMapping("/paged")
    public ResponseEntity<PagedResponse<InsurancePolicyDTO>> getPoliciesPaginated(
            @RequestParam(value = "page", defaultValue = ""+PaginationConfig.DEFAULT_PAGE) int page,
            @RequestParam(value = "size", defaultValue = ""+PaginationConfig.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "sort", defaultValue = PaginationConfig.DEFAULT_SORT_FIELD) String sort,
            @RequestParam(value = "direction", defaultValue = PaginationConfig.DEFAULT_SORT_DIRECTION) String direction) {

        PagedResponse<InsurancePolicyDTO> pagedResponse = policyService.getPoliciesPaginated(page, size, sort, direction);
        return ResponseEntity.ok(pagedResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsurancePolicyDTO> getPolicyById(@PathVariable Long id) {
        InsurancePolicyDTO policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(policy);
    }

    @PostMapping
    public ResponseEntity<InsurancePolicyDTO> createPolicy(
            @Valid @RequestBody InsurancePolicyDTO policyDTO) {
        InsurancePolicyDTO createdPolicy = policyService.createPolicy(policyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPolicy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsurancePolicyDTO> updatePolicy(
            @PathVariable Long id, @Valid @RequestBody InsurancePolicyDTO policyDTO) {
        InsurancePolicyDTO updatedPolicy = policyService.updatePolicy(id, policyDTO);
        return ResponseEntity.ok(updatedPolicy);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Exception Handling

Custom exceptions and a global exception handler for standardized error responses:

**PolicyNotFoundException.java**

```java
public class PolicyNotFoundException extends RuntimeException {
    public PolicyNotFoundException(String message) {
        super(message);
    }
}
```

**GlobalExceptionHandler.java**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PolicyNotFoundException.class)
    public ResponseEntity<ApiError> handlePolicyNotFoundException(PolicyNotFoundException ex) {
        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiError apiError = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Validation error: " + errorMessage,
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalException(Exception ex) {
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred: " + ex.getMessage(),
                LocalDateTime.now());
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### Configuration

**PaginationConfig.java** - Centralized pagination configuration:

```java
public class PaginationConfig {
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_PAGE_SIZE = 5;
    public static final String DEFAULT_SORT_FIELD = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";
}
```

**WebConfig.java** - Web configuration including CORS settings:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
```

## API Endpoints

The API provides the following endpoints:

| Method | URL                 | Description               | Request Body       | Response                          |
| ------ | ------------------- | ------------------------- | ------------------ | --------------------------------- |
| GET    | /api/policies       | Get all policies          | -                  | List of InsurancePolicyDTO        |
| GET    | /api/policies/paged | Get paginated policies    | -                  | PagedResponse<InsurancePolicyDTO> |
| GET    | /api/policies/{id}  | Get a policy by ID        | -                  | InsurancePolicyDTO                |
| POST   | /api/policies       | Create a new policy       | InsurancePolicyDTO | InsurancePolicyDTO                |
| PUT    | /api/policies/{id}  | Update an existing policy | InsurancePolicyDTO | InsurancePolicyDTO                |
| DELETE | /api/policies/{id}  | Delete a policy           | -                  | No content (204)                  |

### Query Parameters for Pagination

The `/api/policies/paged` endpoint accepts the following query parameters:

- `page`: Page number (zero-based, default: 0)
- `size`: Number of items per page (default: 5)
- `sort`: Field to sort by (default: "id")
- `direction`: Sort direction ("asc" or "desc", default: "asc")

## Data Validation

The application implements comprehensive data validation:

1. **Entity Level Validation**:

   - Policy name cannot be blank
   - Policy status must be provided
   - Coverage start and end dates must be provided
   - Custom validation ensures the end date is after the start date

2. **DTO Level Validation**:
   - Validated using Jakarta validation annotations
   - Spring's `@Valid` annotation enforces validation during request processing

## Database Configuration

### Development (H2 in-memory)

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:insurance_db
    driver-class-name: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
      path: /h2-console
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update
```

### Production (PostgreSQL)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:insurance_db}
    driver-class-name: org.postgresql.Driver
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

## Deployment

The application can be deployed using Docker:

1. Build the JAR file using Maven:

   ```
   mvn clean package
   ```

2. Build the Docker image:

   ```
   docker build -t insurance-policy-backend .
   ```

3. Run the container with environment variables for database configuration:
   ```
   docker run -p 8080:8080 \
     -e DB_HOST=postgres_container \
     -e DB_PORT=5432 \
     -e DB_NAME=insurance_db \
     -e DB_USER=postgres \
     -e DB_PASSWORD=secret \
     -e SPRING_PROFILES_ACTIVE=prod \
     insurance-policy-backend
   ```

## Best Practices Implemented

1. **Layered Architecture**: Clear separation between controllers, services, and repositories
2. **DTO Pattern**: Separate data transfer objects for API communication
3. **Validation**: Comprehensive input validation
4. **Exception Handling**: Centralized error handling with appropriate HTTP status codes
5. **Pagination**: Efficient data retrieval with pagination and sorting
6. **Configuration Management**: Environment-specific configuration
7. **API Documentation**: Swagger UI for API exploration
8. **Data Integrity**: Custom validations to ensure data consistency
9. **CORS Configuration**: Allowing frontend access
10. **Centralized Constants**: Pagination defaults maintained centrally

## Future Improvements

### Performance Enhancements

1. **Caching**: Implement Redis or in-memory caching for frequently accessed data
2. **Query Optimization**: Add indexing and query optimization for larger datasets
3. **Batch Processing**: Implement batch operations for bulk data handling

### Feature Additions

1. **Advanced Search**: Add filtering capabilities by policy attributes
2. **Audit Trail**: Implement history tracking for changes to policies
3. **User Management**: Add authentication and authorization (Spring Security)
4. **File Attachments**: Support for document uploads related to policies
5. **Reporting**: Generate policy reports and analytics

### Technical Enhancements

1. **API Versioning**: Implement versioning strategy for API evolution
2. **Rate Limiting**: Add rate limiting to prevent API abuse
3. **Logging Enhancement**: Implement structured logging and monitoring
4. **Event Sourcing**: Consider event-driven architecture for better scalability

### Testing Improvements

1. **Integration Testing**: Expand integration test coverage
2. **Performance Testing**: Add load and stress testing
3. **Security Testing**: Regular security vulnerability assessments

### DevOps & Infrastructure

1. **CI/CD Pipeline**: Implement automated testing and deployment
2. **Infrastructure as Code**: Define infrastructure using tools like Terraform
3. **Monitoring**: Add application metrics and monitoring with Prometheus/Grafana
4. **Distributed Tracing**: Implement distributed tracing for better debugging
