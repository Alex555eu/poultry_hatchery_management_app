package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostCandlingNestingTrolleyAssignmentRequest;
import com.app.poultry_hatchery_management_app.dto.PostCandlingRequest;
import com.app.poultry_hatchery_management_app.dto.PutCandlingRequest;
import com.app.poultry_hatchery_management_app.model.Candling;
import com.app.poultry_hatchery_management_app.model.CandlingNestingTrolleyAssignment;
import com.app.poultry_hatchery_management_app.service.CandlingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/candling")
public class CandlingController {

    private final ObjectMapper objectMapper;
    private final CandlingService candlingService;

    @GetMapping("/all")
    public ResponseEntity<String> getAllCandlings() throws JsonProcessingException {
        List<Candling> candlingList = candlingService.getAllCandlings();
        if (candlingList.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            String response = objectMapper.writeValueAsString(candlingList);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("")
    public ResponseEntity<String> getCandlingById(@RequestParam UUID candlingId) throws JsonProcessingException {
        Optional<Candling> candling = candlingService.getCandlingById(candlingId);
        if (candling.isPresent()) {
            String response = objectMapper.writeValueAsString(candling);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-nesting")
    public ResponseEntity<String> getCandlingByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Candling> candlingList = candlingService.getCandlingByNestingId(nestingId);
        if (candlingList.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            String response = objectMapper.writeValueAsString(candlingList);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("")
    public ResponseEntity<String> postCandling(@RequestBody PostCandlingRequest request) throws JsonProcessingException {
        Optional<Candling> candling = candlingService.postCandling(request);
        if (candling.isPresent()) {
            String body = objectMapper.writeValueAsString(candling.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("")
    public ResponseEntity<String> putCandling(@RequestBody PutCandlingRequest request) throws JsonProcessingException {
        Optional<Candling> candling = candlingService.putCandling(request);
        if (candling.isPresent()) {
            String body = objectMapper.writeValueAsString(candling.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("")
    public ResponseEntity<String> deleteCandling(@RequestParam UUID candlingId) {
        candlingService.deleteCandling(candlingId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/trolley")
    public ResponseEntity<String> getCandledTrolleyAssignments(@RequestParam UUID candlingId) throws JsonProcessingException {
        List<CandlingNestingTrolleyAssignment> cnta = candlingService.getAllCandledTrolleyAssignments(candlingId);
        if (cnta.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(cnta);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/trolley")
    public ResponseEntity<String> postCandledTrolleyAssignment(@RequestBody PostCandlingNestingTrolleyAssignmentRequest request) throws JsonProcessingException {
        Optional<CandlingNestingTrolleyAssignment> candling = candlingService.postCandledTrolleyAssignment(request);
        if (candling.isPresent()) {
            String body = objectMapper.writeValueAsString(candling.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/trolley")
    public ResponseEntity<String> deleteCandledTrolley(@RequestParam UUID candledNestingTrolleyAssignmentId) {
        candlingService.deleteCandledNestingTrolleyAssignment(candledNestingTrolleyAssignmentId);
        return ResponseEntity.ok().build();
    }



}
