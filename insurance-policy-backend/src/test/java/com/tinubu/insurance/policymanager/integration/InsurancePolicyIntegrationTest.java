package com.tinubu.insurance.policymanager.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.test.context.ActiveProfiles;

import com.tinubu.insurance.policymanager.dto.InsurancePolicyDTO;
import com.tinubu.insurance.policymanager.model.PolicyStatus;
import com.tinubu.insurance.policymanager.repository.InsurancePolicyRepository;
import com.tinubu.insurance.policymanager.service.InsurancePolicyService;

import jakarta.validation.ConstraintViolationException;

@SpringBootTest
@ActiveProfiles("test")
class InsurancePolicyIntegrationTest {

    @Autowired
    private InsurancePolicyService policyService;

    @Autowired
    private InsurancePolicyRepository policyRepository;
    
    @BeforeEach
    void setup() {
        // Clean the database before each test
        policyRepository.deleteAll();
    }

    @Test
    void whenCreateValidPolicy_thenPolicyShouldBeSaved() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Integration Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();

        // Act
        InsurancePolicyDTO savedPolicy = policyService.createPolicy(policyDTO);

        // Assert
        assertNotNull(savedPolicy.getId());
        assertEquals(policyDTO.getPolicyName(), savedPolicy.getPolicyName());
        assertEquals(1, policyRepository.count());
    }

    @Test
    void whenNullPolicyName_thenValidationExceptionShouldBeThrown() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName(null) // Null policy name
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();

        // Act & Assert
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            policyService.createPolicy(policyDTO);
        }, "Expected ConstraintViolationException for null policy name");
        
        // Verify that the exception message mentions the policy name
        assertTrue(exception.getMessage().contains("policyName"), 
                   "Error message should mention the policy name field");
    }
    
    @Test
    void whenNullStartDate_thenValidationExceptionShouldBeThrown() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Policy with null start date")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(null) // Null start date
                .coverageEndDate(today.plusMonths(6))
                .build();

        // Act & Assert
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            policyService.createPolicy(policyDTO);
        }, "Expected ConstraintViolationException for null start date");
        
        // Verify that the exception message mentions the start date
        assertTrue(exception.getMessage().contains("coverageStartDate"), 
                   "Error message should mention the coverage start date field");
    }
    
    @Test
    void whenNullEndDate_thenValidationExceptionShouldBeThrown() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Policy with null end date")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(null) // Null end date
                .build();

        // Act & Assert
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            policyService.createPolicy(policyDTO);
        }, "Expected ConstraintViolationException for null end date");
        
        // Verify that the exception message mentions the end date
        assertTrue(exception.getMessage().contains("coverageEndDate"), 
                   "Error message should mention the coverage end date field");
    }

    @Test
    void whenEndDateBeforeStartDate_thenIllegalArgumentExceptionShouldBeThrown() {
        // Arrange
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Invalid Date Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.minusDays(1)) // End date before start date
                .build();

        // Act & Assert
        Exception exception = assertThrows(InvalidDataAccessApiUsageException.class, () -> {
            policyService.createPolicy(policyDTO);
        });
        
        // The original IllegalArgumentException is wrapped, but the message should be preserved
        assertTrue(exception.getMessage().contains("Coverage end date must be after start date"),
                "Error message should mention that end date must be after start date");
    }
    
    @Test
    void whenUpdatePolicy_thenPolicyShouldBeUpdated() {
        // Arrange - Create initial policy
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Initial Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
        
        InsurancePolicyDTO savedPolicy = policyService.createPolicy(policyDTO);
        Long policyId = savedPolicy.getId();
        
        // Create updated policy
        InsurancePolicyDTO updatedDTO = InsurancePolicyDTO.builder()
                .policyName("Updated Policy")
                .status(PolicyStatus.INACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(12))
                .build();
        
        // Act
        InsurancePolicyDTO result = policyService.updatePolicy(policyId, updatedDTO);
        
        // Assert
        assertEquals("Updated Policy", result.getPolicyName());
        assertEquals(PolicyStatus.INACTIVE, result.getStatus());
        assertEquals(today.plusMonths(12), result.getCoverageEndDate());
    }
    
    @Test
    void whenUpdatePolicyWithNullDate_thenValidationExceptionShouldBeThrown() {
        // Arrange - Create initial policy
        LocalDate today = LocalDate.now();
        InsurancePolicyDTO policyDTO = InsurancePolicyDTO.builder()
                .policyName("Initial Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
        
        InsurancePolicyDTO savedPolicy = policyService.createPolicy(policyDTO);
        Long policyId = savedPolicy.getId();
        
        // Create updated policy with null end date
        InsurancePolicyDTO updatedDTO = InsurancePolicyDTO.builder()
                .policyName("Updated Policy")
                .status(PolicyStatus.INACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(null) // Null end date
                .build();
        
        // Act & Assert
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            policyService.updatePolicy(policyId, updatedDTO);
        }, "Expected ConstraintViolationException for null end date during update");
        
        // Verify that the exception message mentions the end date
        assertTrue(exception.getMessage().contains("coverageEndDate"), 
                   "Error message should mention the coverage end date field");
    }
} 