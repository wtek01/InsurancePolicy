package com.tinubu.insurance.policymanager.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.validation.ConstraintViolationException;

/**
 * Global exception handler that centralizes exception handling across the application.
 * It provides custom error responses for different types of exceptions.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Handles PolicyNotFoundException which occurs when a policy cannot be found by ID.
     * Returns a 404 Not Found status with the exception message.
     * This exception is thrown from service layer when findById operations fail.
     */
    @ExceptionHandler(PolicyNotFoundException.class)
    public ResponseEntity<Object> handlePolicyNotFoundException(
            PolicyNotFoundException ex, WebRequest request) {
        return createErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles IllegalArgumentException which occurs when invalid data is provided.
     * Returns a 400 Bad Request status with the exception message.
     * This exception is thrown from business validation like the date validation in 
     * InsurancePolicy's validateDates method.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        return createErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles validation failures for @Valid annotated request parameters or bodies.
     * Returns a 400 Bad Request status with all field validation errors.
     * This handles validation failures from controller method parameters annotated with @Valid,
     * providing detailed error messages for each invalid field.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, 
            HttpHeaders headers, 
            HttpStatusCode status, 
            WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        
        // Get all validation errors
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                    error -> error.getField(), 
                    error -> error.getDefaultMessage(),
                    (existingMessage, newMessage) -> existingMessage + "; " + newMessage
                ));
        
        body.put("errors", errors);
        body.put("message", "Validation failed");
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handles constraint violations from the validation framework.
     * Returns a 400 Bad Request status with all constraint violation details.
     * This handles validation failures triggered by annotated fields in entity classes
     * or service method parameters with validation annotations.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        
        // Get all constraint violations
        Map<String, String> errors = ex.getConstraintViolations()
                .stream()
                .collect(Collectors.toMap(
                    violation -> violation.getPropertyPath().toString(),
                    violation -> violation.getMessage(),
                    (existingMessage, newMessage) -> existingMessage + "; " + newMessage
                ));
        
        body.put("errors", errors);
        body.put("message", "Validation failed");
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Fallback exception handler that catches any unhandled exceptions.
     * Returns a 500 Internal Server Error status with a generic error message.
     * This provides a safety net for unexpected errors and prevents exposing
     * sensitive error details to clients.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllUncaughtException(
            Exception ex, WebRequest request) {
        return createErrorResponse("An unexpected error occurred: " + ex.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Helper method to create consistent error response structures.
     * Creates a standardized error response with timestamp, message, and status code.
     */
    private ResponseEntity<Object> createErrorResponse(String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", message);
        body.put("status", status.value());
        
        return new ResponseEntity<>(body, status);
    }
}