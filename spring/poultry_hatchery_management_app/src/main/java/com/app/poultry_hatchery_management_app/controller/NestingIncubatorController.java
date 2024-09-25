package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.model.NestingIncubator;
import com.app.poultry_hatchery_management_app.model.NestingIncubatorSpace;
import com.app.poultry_hatchery_management_app.service.NestingIncubatorService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
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

    @GetMapping("/")
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

    @PostMapping("/")
    public ResponseEntity<String> postNestingIncubator(@RequestBody PostNestingIncubatorRequest request) {
        Optional<NestingIncubator> incubator = nestingIncubatorService.postNestingIncubator(request);
        if (incubator.isPresent()) {
            for (int i = 0; i < incubator.get().getMaxCapacity(); i++) {
                PostNestingIncubatorSpaceRequest request2 = PostNestingIncubatorSpaceRequest.builder()
                        .humanReadableId("")
                        .nestingIncubatorId(incubator.get().getId())
                        .build();
                Optional<NestingIncubatorSpace> nestingSpace = nestingIncubatorService.postNestingIncubatorSpace(request2);
                if (nestingSpace.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.MULTI_STATUS).body("Incubator created. Error while creating incubator space.");
                }
            }
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putNestingIncubator(@RequestBody PutNestingIncubatorRequest request){
        Optional<NestingIncubator> incubator = nestingIncubatorService.putNestingIncubator(request);
        if (incubator.isPresent()){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
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

    @PostMapping("/space")
    public ResponseEntity<String> postNestingIncubatorSpace(@RequestBody PostNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.postNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/space")
    public ResponseEntity<String> putNestingIncubatorSpace(@RequestBody PutNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorService.putNestingIncubatorSpace(request);
        if (space.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/space")
    public ResponseEntity<String> deleteNestingIncubatorSpace(@RequestParam UUID incubatorSpaceId) {
        nestingIncubatorService.deleteNestingIncubatorSpace(incubatorSpaceId);
        return ResponseEntity.ok().build();
    }

}
