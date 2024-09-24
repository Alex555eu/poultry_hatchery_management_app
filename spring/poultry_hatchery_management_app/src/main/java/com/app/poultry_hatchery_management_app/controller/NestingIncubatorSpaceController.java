package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.model.NestingIncubatorSpace;
import com.app.poultry_hatchery_management_app.service.NestingIncubatorService;
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
@RequestMapping("api/v1/nesting-incubator-space")
public class NestingIncubatorSpaceController {

    private final NestingIncubatorService nestingIncubatorService;
    private final ObjectMapper objectMapper;

    @GetMapping("/")
    public ResponseEntity<String> getAllNestingIncubatorSpaces(@RequestParam UUID incubatorId) throws JsonProcessingException {
        List<NestingIncubatorSpace> result = nestingIncubatorService.getAllNestingIncubatorSpaces(incubatorId);
        if (!result.isEmpty()) {
            String response = objectMapper.writeValueAsString(result);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<String> postNestingIncubatorSpace(@RequestBody PostNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.postNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putNestingIncubatorSpace(@RequestBody PutNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.putNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteNestingIncubatorSpace(@RequestParam UUID incubatorSpaceId) {
        nestingIncubatorService.deleteNestingIncubatorSpace(incubatorSpaceId);
        return ResponseEntity.ok().build();
    }

}
