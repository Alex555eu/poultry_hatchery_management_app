package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import com.app.poultry_hatchery_management_app.service.NestingTrolleyService;
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
@RequestMapping("api/v1/nesting-trolley")
public class NestingTrolleyController {

    private final NestingTrolleyService nestingTrolleyService;
    private final ObjectMapper objectMapper;

    @GetMapping("/")
    public ResponseEntity<String> getAllTrolleys() throws JsonProcessingException {
        List<NestingTrolley> trolleyList = nestingTrolleyService.getAllTrolleys();
        if (trolleyList == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (trolleyList.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(trolleyList);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/")
    public ResponseEntity<String> postTrolley(@RequestBody PostNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyService.postTrolley(request);
        if (trolley.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putTrolley(@RequestBody PutNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyService.putTrolley(request);
        if (trolley.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteTrolley(@RequestParam UUID trolleyId) {
        nestingTrolleyService.deleteTrolley(trolleyId);
        return ResponseEntity.ok().build();
    }

}
