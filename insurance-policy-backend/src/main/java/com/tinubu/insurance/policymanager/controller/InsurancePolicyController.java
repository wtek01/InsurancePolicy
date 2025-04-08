package com.tinubu.insurance.policymanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tinubu.insurance.policymanager.config.PaginationConfig;
import com.tinubu.insurance.policymanager.dto.InsurancePolicyDTO;
import com.tinubu.insurance.policymanager.dto.PagedResponse;
import com.tinubu.insurance.policymanager.service.InsurancePolicyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class InsurancePolicyController {

    private final InsurancePolicyService policyService;

    @GetMapping
    public ResponseEntity<List<InsurancePolicyDTO>> getAllPolicies() {
        List<InsurancePolicyDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
    
    @GetMapping("/paged")
    public ResponseEntity<PagedResponse<InsurancePolicyDTO>> getPoliciesPaginated(
            @RequestParam(value = "page", defaultValue = ""+PaginationConfig.DEFAULT_PAGE) int page,
            @RequestParam(value = "size", defaultValue = ""+PaginationConfig.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(value = "sort", defaultValue = PaginationConfig.DEFAULT_SORT_FIELD) String sort,
            @RequestParam(value = "direction", defaultValue = PaginationConfig.DEFAULT_SORT_DIRECTION) String direction) {
        
        PagedResponse<InsurancePolicyDTO> pagedResponse = policyService.getPoliciesPaginated(page, size, sort, direction);
        return ResponseEntity.ok(pagedResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsurancePolicyDTO> getPolicyById(@PathVariable Long id) {
        InsurancePolicyDTO policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(policy);
    }

    @PostMapping
    public ResponseEntity<InsurancePolicyDTO> createPolicy(
            @Valid @RequestBody InsurancePolicyDTO policyDTO) {
        InsurancePolicyDTO createdPolicy = policyService.createPolicy(policyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPolicy);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsurancePolicyDTO> updatePolicy(
            @PathVariable Long id, @Valid @RequestBody InsurancePolicyDTO policyDTO) {
        InsurancePolicyDTO updatedPolicy = policyService.updatePolicy(id, policyDTO);
        return ResponseEntity.ok(updatedPolicy);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}