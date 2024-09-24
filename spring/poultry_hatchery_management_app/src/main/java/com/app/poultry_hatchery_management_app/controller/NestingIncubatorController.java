package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.service.NestingIncubatorService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting-incubator")
public class NestingIncubatorController {

    private final NestingIncubatorService nestingIncubatorService;

    @GetMapping("/")
    public ResponseEntity<String> getAllNestingIncubators() throws JsonProcessingException {
        return nestingIncubatorService.getAllNestingIncubators();
    }

    @PostMapping("/")
    public ResponseEntity<String> postNestingIncubator(@RequestBody PostNestingIncubatorRequest request) {
        return nestingIncubatorService.postNestingIncubator(request);
    }

    @PutMapping("/")
    public ResponseEntity<String> putNestingIncubator(@RequestBody PutNestingIncubatorRequest request){
        return nestingIncubatorService.putNestingIncubator(request);
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteNestingIncubator(@RequestParam UUID incubatorId) {
        return nestingIncubatorService.deleteNestingIncubator(incubatorId);
    }

}
