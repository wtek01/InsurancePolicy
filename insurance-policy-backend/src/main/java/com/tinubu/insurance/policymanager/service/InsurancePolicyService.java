package com.tinubu.insurance.policymanager.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.tinubu.insurance.policymanager.dto.InsurancePolicyDTO;
import com.tinubu.insurance.policymanager.exception.PolicyNotFoundException;
import com.tinubu.insurance.policymanager.model.InsurancePolicy;
import com.tinubu.insurance.policymanager.repository.InsurancePolicyRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Validated
public class InsurancePolicyService {
    private final InsurancePolicyRepository policyRepository;

    public List<InsurancePolicyDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InsurancePolicyDTO getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new PolicyNotFoundException("Policy not found with id: " + id));
        return convertToDTO(policy);
    }

    public InsurancePolicyDTO createPolicy(@Valid InsurancePolicyDTO policyDTO) {
        InsurancePolicy policy = convertToEntity(policyDTO);
        policy.setCreatedAt(LocalDate.now());
        policy.setUpdatedAt(LocalDate.now());
        InsurancePolicy savedPolicy = policyRepository.save(policy);
        return convertToDTO(savedPolicy);
    }

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

    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new PolicyNotFoundException("Policy not found with id: " + id);
        }
        policyRepository.deleteById(id);
    }

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