package com.tinubu.insurance.policymanager.dto;

import java.time.LocalDate;

import com.tinubu.insurance.policymanager.model.PolicyStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsurancePolicyDTO {
    private Long id;
    
    @NotBlank(message = "Policy name is required")
    private String policyName;
    
    @NotNull(message = "Status is required")
    private PolicyStatus status;
    
    @NotNull(message = "Coverage start date is required")
    private LocalDate coverageStartDate;
    
    @NotNull(message = "Coverage end date is required")
    private LocalDate coverageEndDate;
    
    private LocalDate createdAt;
    private LocalDate updatedAt;
    
    // Custom validation to ensure end date is after start date
    public void validateDates() {
        LocalDate today = LocalDate.now();
        
        // Validate that start date is not in the past
        if (coverageStartDate != null && coverageStartDate.isBefore(today)) {
            throw new IllegalArgumentException("Coverage start date cannot be in the past");
        }
        
        // Validate that end date is after start date
        if (coverageEndDate != null && coverageStartDate != null 
                && coverageEndDate.isBefore(coverageStartDate)) {
            throw new IllegalArgumentException("Coverage end date must be after start date");
        }
    }
}