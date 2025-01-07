package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.HatchingIncubator;
import com.app.poultry_hatchery_management_app.model.HatchingIncubatorSpace;
import com.app.poultry_hatchery_management_app.model.HatchingTrolleyIncubatorSpaceAssignment;
import com.app.poultry_hatchery_management_app.service.HatchingIncubatorService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/hatching-incubator")
public class HatchingIncubatorController {

    private final ObjectMapper objectMapper;
    private final HatchingIncubatorService hatchingIncubatorService;


    @GetMapping("/")
    public ResponseEntity<String> getAllHatchingIncubators() throws JsonProcessingException {
        List<HatchingIncubator> incubatorList = hatchingIncubatorService.getAllHatchingIncubators();
        if (incubatorList == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(incubatorList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(incubatorList);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-id")
    public ResponseEntity<String> getHatchingIncubatorById(@RequestParam UUID incubatorId) throws JsonProcessingException {
        Optional<HatchingIncubator> incubator = hatchingIncubatorService.getHatchingIncubatorById(incubatorId);
        if(incubator.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(incubator.get());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    public ResponseEntity<String> postHatchingIncubator(@RequestBody PostHatchingIncubatorRequest request) {
        Optional<HatchingIncubator> incubator = hatchingIncubatorService.postHatchingIncubator(request);
        if (incubator.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putHatchingIncubator(@RequestBody PutHatchingIncubatorRequest request) {
        Optional<HatchingIncubator> incubator = hatchingIncubatorService.putHatchingIncubator(request);
        if (incubator.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteHatchingIncubator(@RequestParam UUID hatchingIncubatorId) {
        hatchingIncubatorService.deleteHatchingIncubator(hatchingIncubatorId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/space")
    public ResponseEntity<String> getAllHatchingIncubatorsSpace(@RequestParam UUID hatchingIncubatorId) throws JsonProcessingException {
        List<HatchingIncubatorSpace> incubatorList = hatchingIncubatorService.getAllHatchingIncubatorsSpace(hatchingIncubatorId);
        if(incubatorList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(incubatorList);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/space")
    public ResponseEntity<String> postHatchingIncubatorSpace(@RequestBody PostHatchingIncubatorSpaceRequest request) {
        Optional<HatchingIncubatorSpace> incubator = hatchingIncubatorService.postHatchingIncubatorSpace(request);
        if (incubator.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/space")
    public ResponseEntity<String> putHatchingIncubatorSpace(@RequestBody PutHatchingIncubatorSpaceRequest request) {
        Optional<HatchingIncubatorSpace> incubator = hatchingIncubatorService.putHatchingIncubatorSpace(request);
        if (incubator.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/space")
    public ResponseEntity<String> deleteHatchingIncubatorSpace(@RequestParam UUID hatchingIncubatorSpaceId) {
        hatchingIncubatorService.deleteHatchingIncubatorSpace(hatchingIncubatorSpaceId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/occupation")
    public ResponseEntity<String> getAllTrolleysFromHatchingIncubator(@RequestParam UUID hatchingIncubatorId) throws JsonProcessingException {
        List<HatchingTrolleyIncubatorSpaceAssignment> assignment = hatchingIncubatorService.getAllTrolleysFromHatchingIncubator(hatchingIncubatorId);
        if(assignment.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(assignment);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/occupation")
    public ResponseEntity<String> postHatchingTrolleyToIncubatorSpace(@RequestBody PostHatchingTrolleyIncubatorSpaceAssignmentRequest request) {
        Optional<HatchingTrolleyIncubatorSpaceAssignment> assignment = hatchingIncubatorService.postHatchingTrolleyToIncubatorSpace(request);
        if (assignment.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/occupation")
    public ResponseEntity<String> putHatchingTrolleyToIncubatorSpace(@RequestBody PutHatchingTrolleyIncubatorSpaceAssignmentRequest request) {
        Optional<HatchingTrolleyIncubatorSpaceAssignment> assignment = hatchingIncubatorService.putHatchingTrolleyToIncubatorSpace(request);
        if (assignment.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/occupation")
    public ResponseEntity<String> deleteHatchingTrolleyFromIncubatorSpace(@RequestParam UUID hatchingTrolleyIncubatorSpaceAssignmentId) {
        hatchingIncubatorService.deleteHatchingTrolleyFromIncubatorSpace(hatchingTrolleyIncubatorSpaceAssignmentId);
        return ResponseEntity.ok().build();
    }

}
