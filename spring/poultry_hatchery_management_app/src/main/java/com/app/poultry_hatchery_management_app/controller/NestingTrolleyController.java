package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.service.NestingTrolleyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting-trolley")
public class NestingTrolleyController {

    private final NestingTrolleyService nestingTrolleyService;

    @GetMapping("/")
    public ResponseEntity<String> getAllTrolleys() throws JsonProcessingException {
        return nestingTrolleyService.getAllTrolleys();
    }

    @PostMapping("/")
    public ResponseEntity<String> postTrolley(@RequestBody PostNestingTrolleyRequest request) {
        return nestingTrolleyService.postTrolley(request);
    }

    @PutMapping("/")
    public ResponseEntity<String> putTrolley(@RequestBody PutNestingTrolleyRequest request) {
        return nestingTrolleyService.putTrolley(request);
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteTrolley(@RequestParam UUID trolleyId) {
        return nestingTrolleyService.deleteTrolley(trolleyId);
    }

}
