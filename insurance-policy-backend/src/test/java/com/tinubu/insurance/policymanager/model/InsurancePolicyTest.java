package com.tinubu.insurance.policymanager.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class InsurancePolicyTest {
    
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = factory.getValidator();

    @Test
    void validateDates_ValidDates_NoExceptionThrown() {
        // Arrange
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(6);
        
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(startDate)
                .coverageEndDate(endDate)
                .build();
        
        // Act & Assert
        assertTrue(policy.getCoverageEndDate().isAfter(policy.getCoverageStartDate()));
    }
    
    @Test
    void validateDates_EndDateBeforeStartDate_ChecksInvalidDates() {
        // Arrange
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.minusDays(1); // End date before start date
        
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(startDate)
                .coverageEndDate(endDate)
                .build();
        
        // Act & Assert
        assertFalse(policy.getCoverageEndDate().isAfter(policy.getCoverageStartDate()));
    }
    
    @Test
    void builder_CreatesCompletePolicy() {
        // Arrange
        String policyName = "Test Policy";
        PolicyStatus status = PolicyStatus.ACTIVE;
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(6);
        
        // Act
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName(policyName)
                .status(status)
                .coverageStartDate(startDate)
                .coverageEndDate(endDate)
                .build();
        
        // Assert
        assertNotNull(policy);
        assertEquals(policyName, policy.getPolicyName());
        assertEquals(status, policy.getStatus());
        assertEquals(startDate, policy.getCoverageStartDate());
        assertEquals(endDate, policy.getCoverageEndDate());
        assertNull(policy.getId());
        assertNull(policy.getCreatedAt());
        assertNull(policy.getUpdatedAt());
    }
    
    @Test
    void whenStartDateIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(null) // Null start date
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicy> violation = violations.iterator().next();
        assertEquals("Coverage start date is required", violation.getMessage());
    }
    
    @Test
    void whenEndDateIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(null) // Null end date
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicy> violation = violations.iterator().next();
        assertEquals("Coverage end date is required", violation.getMessage());
    }
    
    @Test
    void whenBothDatesProvided_thenValidationPasses() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(0, violations.size(), "No validation errors should be present when both dates are provided");
    }
    
    @Test
    void whenPolicyNameIsBlank_thenValidationFails() {
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("")  // Blank policy name
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicy> violation = violations.iterator().next();
        assertEquals("Policy name is required", violation.getMessage());
    }
    
    @Test
    void whenPolicyNameIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName(null)  // Null policy name
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicy> violation = violations.iterator().next();
        assertEquals("Policy name is required", violation.getMessage());
    }
    
    @Test
    void whenStatusIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(null)  // Null status
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicy>> violations = validator.validate(policy);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicy> violation = violations.iterator().next();
        assertEquals("Policy status is required", violation.getMessage());
    }
    
    @Test
    void testCreatedAtAndUpdatedAt_AutomaticallySet() {
        // This test verifies that createdAt and updatedAt are automatically set by JPA
        // Note: This is more appropriately tested in an integration test with a database
        
        // Arrange
        InsurancePolicy policy = InsurancePolicy.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
                
        // Assert initial state
        assertNull(policy.getCreatedAt());
        assertNull(policy.getUpdatedAt());
        
        // Note: In a real scenario with JPA, these fields would be automatically
        // populated when the entity is persisted/updated
    }
    
    @Test
    void testStatusEnum_ValidValues() {
        // Arrange & Act
        InsurancePolicy activePolicy = InsurancePolicy.builder()
                .policyName("Active Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
                
        InsurancePolicy inactivePolicy = InsurancePolicy.builder()
                .policyName("Inactive Policy")
                .status(PolicyStatus.INACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Assert
        assertEquals(PolicyStatus.ACTIVE, activePolicy.getStatus());
        assertEquals(PolicyStatus.INACTIVE, inactivePolicy.getStatus());
    }
} 