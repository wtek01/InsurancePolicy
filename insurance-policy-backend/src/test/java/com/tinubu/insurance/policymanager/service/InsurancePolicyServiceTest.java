package com.tinubu.insurance.policymanager.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tinubu.insurance.policymanager.dto.InsurancePolicyDTO;
import com.tinubu.insurance.policymanager.exception.PolicyNotFoundException;
import com.tinubu.insurance.policymanager.model.InsurancePolicy;
import com.tinubu.insurance.policymanager.model.PolicyStatus;
import com.tinubu.insurance.policymanager.repository.InsurancePolicyRepository;

@ExtendWith(MockitoExtension.class)
class InsurancePolicyServiceTest {

    @Mock
    private InsurancePolicyRepository policyRepository;

    @InjectMocks
    private InsurancePolicyService policyService;

    private InsurancePolicy testPolicy;
    private InsurancePolicyDTO testPolicyDTO;
    
    @BeforeEach
    void setUp() {
        LocalDate today = LocalDate.now();
        
        testPolicy = InsurancePolicy.builder()
                .id(1L)
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
                
        testPolicyDTO = InsurancePolicyDTO.builder()
                .policyName("Test Policy")
                .status(PolicyStatus.ACTIVE)
                .coverageStartDate(today)
                .coverageEndDate(today.plusMonths(6))
                .build();
    }

    @Test
    void getAllPolicies_ReturnsAllPolicies() {
        // Arrange
        when(policyRepository.findAll()).thenReturn(Arrays.asList(testPolicy));

        // Act
        List<InsurancePolicyDTO> result = policyService.getAllPolicies();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testPolicy.getId(), result.get(0).getId());
        assertEquals(testPolicy.getPolicyName(), result.get(0).getPolicyName());
        
        verify(policyRepository, times(1)).findAll();
    }

    @Test
    void getPolicyById_WithValidId_ReturnsPolicy() {
        // Arrange
        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));

        // Act
        InsurancePolicyDTO result = policyService.getPolicyById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testPolicy.getId(), result.getId());
        assertEquals(testPolicy.getPolicyName(), result.getPolicyName());
        assertEquals(testPolicy.getStatus(), result.getStatus());
        
        verify(policyRepository, times(1)).findById(1L);
    }

    @Test
    void getPolicyById_WithInvalidId_ThrowsException() {
        // Arrange
        when(policyRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PolicyNotFoundException.class, () -> {
            policyService.getPolicyById(999L);
        });
        
        verify(policyRepository, times(1)).findById(999L);
    }

    @Test
    void createPolicy_WithValidData_ReturnsSavedPolicy() {
        // Arrange
        ArgumentCaptor<InsurancePolicy> policyCaptor = ArgumentCaptor.forClass(InsurancePolicy.class);
        when(policyRepository.save(any(InsurancePolicy.class))).thenReturn(testPolicy);

        // Act
        InsurancePolicyDTO result = policyService.createPolicy(testPolicyDTO);

        // Assert
        verify(policyRepository).save(policyCaptor.capture());
        InsurancePolicy capturedPolicy = policyCaptor.getValue();
        
        assertEquals(testPolicyDTO.getPolicyName(), capturedPolicy.getPolicyName());
        assertEquals(testPolicyDTO.getStatus(), capturedPolicy.getStatus());
        assertNotNull(capturedPolicy.getCreatedAt());
        assertNotNull(capturedPolicy.getUpdatedAt());
        
        assertEquals(testPolicy.getId(), result.getId());
    }

    @Test
    void updatePolicy_WithValidIdAndData_ReturnsUpdatedPolicy() {
        // Arrange
        Long policyId = 1L;
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(InsurancePolicy.class))).thenReturn(testPolicy);

        // Create an updated DTO
        InsurancePolicyDTO updatedDTO = InsurancePolicyDTO.builder()
                .policyName("Updated Policy")
                .status(PolicyStatus.INACTIVE)
                .coverageStartDate(LocalDate.now())
                .coverageEndDate(LocalDate.now().plusMonths(12))
                .build();

        // Act
        InsurancePolicyDTO result = policyService.updatePolicy(policyId, updatedDTO);

        // Assert
        // First verify the returned DTO has expected values
        assertNotNull(result, "The returned result should not be null");
        assertEquals(testPolicy.getId(), result.getId(), "The policy ID should match");
        assertEquals(updatedDTO.getPolicyName(), result.getPolicyName(), "Policy name should be updated");
        assertEquals(updatedDTO.getStatus(), result.getStatus(), "Status should be updated");
        assertEquals(updatedDTO.getCoverageStartDate(), result.getCoverageStartDate(), "Start date should be updated");
        assertEquals(updatedDTO.getCoverageEndDate(), result.getCoverageEndDate(), "End date should be updated");
        
        // Then verify the correct data was passed to the repository
        ArgumentCaptor<InsurancePolicy> policyCaptor = ArgumentCaptor.forClass(InsurancePolicy.class);
        verify(policyRepository).save(policyCaptor.capture());
        
        InsurancePolicy savedPolicy = policyCaptor.getValue();
        assertEquals(updatedDTO.getPolicyName(), savedPolicy.getPolicyName());
        assertEquals(updatedDTO.getStatus(), savedPolicy.getStatus());
        assertEquals(updatedDTO.getCoverageStartDate(), savedPolicy.getCoverageStartDate());
        assertEquals(updatedDTO.getCoverageEndDate(), savedPolicy.getCoverageEndDate());
        assertNotNull(savedPolicy.getUpdatedAt());
    }

    @Test
    void updatePolicy_WithInvalidId_ThrowsException() {
        // Arrange
        Long policyId = 999L;
        when(policyRepository.findById(policyId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PolicyNotFoundException.class, () -> {
            policyService.updatePolicy(policyId, testPolicyDTO);
        });
        
        verify(policyRepository, never()).save(any());
    }

    @Test
    void deletePolicy_WithValidId_DeletesPolicy() {
        // Arrange
        Long policyId = 1L;
        when(policyRepository.existsById(policyId)).thenReturn(true);
        doNothing().when(policyRepository).deleteById(policyId);

        // Act
        policyService.deletePolicy(policyId);

        // Assert
        verify(policyRepository, times(1)).deleteById(policyId);
    }

    @Test
    void deletePolicy_WithInvalidId_ThrowsException() {
        // Arrange
        Long policyId = 999L;
        when(policyRepository.existsById(policyId)).thenReturn(false);

        // Act & Assert
        assertThrows(PolicyNotFoundException.class, () -> {
            policyService.deletePolicy(policyId);
        });
        
        verify(policyRepository, never()).deleteById(any());
    }
    
    @Test
    void convertToDTO_ReturnsCorrectDTO() {
        // This test indirectly tests the private convertToDTO method
        // Arrange
        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        
        // Act
        InsurancePolicyDTO result = policyService.getPolicyById(1L);
        
        // Assert
        assertEquals(testPolicy.getId(), result.getId());
        assertEquals(testPolicy.getPolicyName(), result.getPolicyName());
        assertEquals(testPolicy.getStatus(), result.getStatus());
        assertEquals(testPolicy.getCoverageStartDate(), result.getCoverageStartDate());
        assertEquals(testPolicy.getCoverageEndDate(), result.getCoverageEndDate());
        assertEquals(testPolicy.getCreatedAt(), result.getCreatedAt());
        assertEquals(testPolicy.getUpdatedAt(), result.getUpdatedAt());
    }
} 