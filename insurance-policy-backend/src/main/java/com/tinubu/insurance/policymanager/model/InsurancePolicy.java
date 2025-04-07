package com.tinubu.insurance.policymanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;

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