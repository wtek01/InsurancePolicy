package com.tinubu.insurance.policymanager.dto;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.tinubu.insurance.policymanager.model.PolicyStatus;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class InsurancePolicyDTOTest {
    
    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = factory.getValidator();

    @Test
    void validateDates_ValidDates_NoExceptionThrown() {
        // Arrange
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(6);
        
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(startDate)
                .coverageEndDate(endDate)
                .build();
        
        // Act & Assert
        assertDoesNotThrow(policyDTO::validateDates);
    }
    
    @Test
    void validateDates_EndDateBeforeStartDate_ThrowsIllegalArgumentException() {
        // Arrange
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.minusDays(1); // End date before start date
        
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(startDate)
                .coverageEndDate(endDate)
                .build();
        
        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                policyDTO::validateDates
        );
        
        assertEquals("Coverage end date must be after start date", exception.getMessage());
    }
    
    @Test
    void whenStartDateIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(null) // Null start date
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicyDTO> violation = violations.iterator().next();
        assertEquals("Coverage start date is required", violation.getMessage());
    }
    
    @Test
    void whenEndDateIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(null) // Null end date
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicyDTO> violation = violations.iterator().next();
        assertEquals("Coverage end date is required", violation.getMessage());
    }
    
    @Test
    void whenBothDatesArePresent_thenValidationPasses() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(0, violations.size(), "No validation errors should be present");
    }
    
    @Test
    void whenPolicyNameIsBlank_thenValidationFails() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("") // Blank policy name
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicyDTO> violation = violations.iterator().next();
        assertEquals("Policy name is required", violation.getMessage());
    }
    
    @Test
    void whenPolicyNameIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName(null) // Null policy name
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicyDTO> violation = violations.iterator().next();
        assertEquals("Policy name is required", violation.getMessage());
    }
    
    @Test
    void whenStatusIsNull_thenValidationFails() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(null) // Null status
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(1, violations.size());
        ConstraintViolation<InsurancePolicyDTO> violation = violations.iterator().next();
        assertEquals("Status is required", violation.getMessage());
    }
    
    @Test
    void testCreatedAtAndUpdatedAt_NotRequiredForValidation() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                // createdAt and updatedAt not set
                .build();
        
        // Act
        Set<ConstraintViolation<InsurancePolicyDTO>> violations = validator.validate(policyDTO);
        
        // Assert
        assertEquals(0, violations.size(), "Should not have validation errors since createdAt and updatedAt aren't required");
    }

    
    @Test
    void testStatusEnum_ValidValues() {
        // Arrange & Act
        InsurancePolicyDTO activeDTO = InsurancePolicyDTO.builder()
                .policyName("Active Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
                
        InsurancePolicyDTO inactiveDTO = InsurancePolicyDTO.builder()
                .policyName("Inactive Policy")
                .status(PolicyStatus.INACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(6))
                .build();
        
        // Assert
        assertEquals(PolicyStatus.ACTIVE, activeDTO.getStatus());
        assertEquals(PolicyStatus.INACTIVE, inactiveDTO.getStatus());
    }
    
    @Test
    void validateDates_StartDateNull_NoExceptionThrown() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(null)
                .coverageEndDate(LocalDate.now())
                .build();
        
        // Act & Assert - Should not throw exception when start date is null
        assertDoesNotThrow(policyDTO::validateDates);
    }
    
    @Test
    void validateDates_EndDateNull_NoExceptionThrown() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(null)
                .build();
        
        // Act & Assert - Should not throw exception when end date is null
        assertDoesNotThrow(policyDTO::validateDates);
    }
    
    @Test
    void validateDates_BothDatesNull_NoExceptionThrown() {
        // Arrange
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(null)
                .coverageEndDate(null)
                .build();
        
        // Act & Assert - Should not throw exception when both dates are null
        assertDoesNotThrow(policyDTO::validateDates);
    }
    
    @Test
    void testDTO_GettersAndSetters() {
        // Arrange
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusMonths(6);
        Long id = 123L;
        String policyName = "Test Policy";
        PolicyStatus status = PolicyStatus.ACTIVE;
        
        // Act - Use setters
        InsurancePolicyDTO policyDTO = new InsurancePolicyDTO();
        policyDTO.setId(id);
        policyDTO.setPolicyName(policyName);
        policyDTO.setStatus(status);
        policyDTO.setCoverageStartDate(today);
        policyDTO.setCoverageEndDate(endDate);
        policyDTO.setCreatedAt(today);
        policyDTO.setUpdatedAt(today);
        
        // Assert - Test getters
        assertEquals(id, policyDTO.getId());
        assertEquals(policyName, policyDTO.getPolicyName());
        assertEquals(status, policyDTO.getStatus());
        assertEquals(today, policyDTO.getCoverageStartDate());
        assertEquals(endDate, policyDTO.getCoverageEndDate());
        assertEquals(today, policyDTO.getCreatedAt());
        assertEquals(today, policyDTO.getUpdatedAt());
    }
} 