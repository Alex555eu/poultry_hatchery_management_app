package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.NestingIncubator;
import com.app.poultry_hatchery_management_app.model.NestingIncubatorSpace;
import com.app.poultry_hatchery_management_app.model.NestingTrolleyIncubatorSpaceAssignment;
import com.app.poultry_hatchery_management_app.service.NestingIncubatorService;
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
@RequestMapping("api/v1/nesting-incubator")
public class NestingIncubatorController {

    private final NestingIncubatorService nestingIncubatorService;
    private final ObjectMapper objectMapper;

    @GetMapping("/all")
    public ResponseEntity<String> getAllNestingIncubators() throws JsonProcessingException {
        List<NestingIncubator> incubators = nestingIncubatorService.getAllNestingIncubators();
        if (incubators == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (incubators.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(incubators);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("")
    public ResponseEntity<String> getNestingIncubator(@RequestParam UUID incubatorId) throws JsonProcessingException {
        Optional<NestingIncubator> incubators = nestingIncubatorService.getNestingIncubatorById(incubatorId);
        if (incubators.isPresent()) {
            String response = objectMapper.writeValueAsString(incubators.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin")
    public ResponseEntity<String> postNestingIncubator(@RequestBody PostNestingIncubatorRequest request) {
        Optional<NestingIncubator> incubator = nestingIncubatorService.postNestingIncubator(request);
        if (incubator.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/admin")
    public ResponseEntity<String> putNestingIncubator(@RequestBody PutNestingIncubatorRequest request){
        Optional<NestingIncubator> incubator = nestingIncubatorService.putNestingIncubator(request);
        if (incubator.isPresent()){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin")
    public ResponseEntity<String> deleteNestingIncubator(@RequestParam UUID incubatorId) {
        nestingIncubatorService.deleteNestingIncubator(incubatorId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/space")
    public ResponseEntity<String> getAllNestingIncubatorSpaces(@RequestParam UUID incubatorId) throws JsonProcessingException {
        List<NestingIncubatorSpace> result = nestingIncubatorService.getAllNestingIncubatorSpaces(incubatorId);
        if (!result.isEmpty()) {
            String response = objectMapper.writeValueAsString(result);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/space")
    public ResponseEntity<String> postNestingIncubatorSpace(@RequestBody PostNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.postNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/space")
    public ResponseEntity<String> putNestingIncubatorSpace(@RequestBody PutNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.putNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/space/swap")
    public ResponseEntity<String> putNestingIncubatorSpaceSwap(@RequestBody PutNestingIncubatorSpaceSwapRequest request) throws JsonProcessingException {
        List<NestingIncubatorSpace> space = nestingIncubatorService.putNestingIncubatorSpaceSwap(request);
        if (!space.isEmpty()) {
            String body = objectMapper.writeValueAsString(space);
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/admin/space")
    public ResponseEntity<String> deleteNestingIncubatorSpace(@RequestParam UUID incubatorSpaceId) {
        nestingIncubatorService.deleteNestingIncubatorSpace(incubatorSpaceId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/occupation")
    public ResponseEntity<String> getNestingTrolleyCurrentlyInIncubator(@RequestParam UUID incubatorId) throws JsonProcessingException {
        List<NestingTrolleyIncubatorSpaceAssignment> result = nestingIncubatorService.getNestingTrolleyCurrentlyInIncubator(incubatorId);
        if (!result.isEmpty()) {
            String response = objectMapper.writeValueAsString(result);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/occupation")
    public ResponseEntity<String> postNestingTrolleyToIncubatorSpace(@RequestBody PostNestingTrolleyToIncubatorRequest request) throws JsonProcessingException {
        Optional<NestingTrolleyIncubatorSpaceAssignment> assignment = nestingIncubatorService.postNestingTrolleyToIncubatorSpace(request);
        if (assignment.isPresent()) {
            String body = objectMapper.writeValueAsString(assignment.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/occupation")
    public ResponseEntity<String> putNestingTrolleyToIncubatorSpace(@RequestBody PutNestingTrolleyToIncubatorRequest request) throws JsonProcessingException {
        Optional<NestingTrolleyIncubatorSpaceAssignment> assignment = nestingIncubatorService.putNestingTrolleyToIncubatorSpace(request);
        if (assignment.isPresent()) {
            String body = objectMapper.writeValueAsString(assignment.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/occupation")
    public ResponseEntity<String> deleteNestingTrolleyFromIncubatorSpace(@RequestParam UUID assignmentId) {
        nestingIncubatorService.deleteNestingTrolleyFromIncubatorSpace(assignmentId);
        return ResponseEntity.ok().build();
    }

}
