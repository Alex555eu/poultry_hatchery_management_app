package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostNestingRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingRequest;
import com.app.poultry_hatchery_management_app.service.NestingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting")
public class NestingController {

    private final NestingService nestingService;

    @GetMapping("/")
    public ResponseEntity<String> getAllNestings() throws JsonProcessingException {
        return nestingService.getAllNestings();
    }

    @PostMapping("/")
    public ResponseEntity<String> postNesting(@RequestBody PostNestingRequest request) {
        return nestingService.postNesting(request);
    }

    @PutMapping("/")
    public ResponseEntity<String> putNesting(@RequestBody PutNestingRequest request) {
        return nestingService.putNesting(request);
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteNesting(@RequestParam UUID nestingId) {
        return nestingService.deleteNesting(nestingId);
    }

}
