package com.tinubu.insurance.policymanager.model;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
        LocalDate today = LocalDate.now();
        
        // Validate that start date is not in the past
        if (coverageStartDate != null && coverageStartDate.isBefore(today)) {
            throw new IllegalArgumentException("Coverage start date cannot be in the past");
        }
        
        // Validate that end date is after start date
        if (coverageEndDate != null && coverageStartDate != null && coverageEndDate.isBefore(coverageStartDate)) {
            throw new IllegalArgumentException("Coverage end date must be after start date");
        }
    }
}