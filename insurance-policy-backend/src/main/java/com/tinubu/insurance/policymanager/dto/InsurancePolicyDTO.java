package com.tinubu.insurance.policymanager.dto;

import com.tinubu.insurance.policymanager.model.PolicyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
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
}