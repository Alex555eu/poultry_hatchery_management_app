package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostNestingRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingRequest;
import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.service.NestingService;
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
@RequestMapping("api/v1/nesting")
public class NestingController {

    private final NestingService nestingService;
    private final ObjectMapper objectMapper;

    @GetMapping("/admin")
    public ResponseEntity<String> getAllNestings() throws JsonProcessingException {
        List<Nesting> nesting = nestingService.getAllNestings();
        if (nesting == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (nesting.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(nesting);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/admin/unfinished")
    public ResponseEntity<String> getAllUnfinishedNestings() throws JsonProcessingException {
        List<Nesting> nesting = nestingService.getAllUnfinishedNestings();
        if (nesting == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (nesting.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(nesting);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/by-id")
    public ResponseEntity<String> getNestingById(@RequestParam UUID nestingId) throws JsonProcessingException {
        Optional<Nesting> nesting = nestingService.getNesting(nestingId);
        if (nesting.isPresent()) {
            String body = objectMapper.writeValueAsString(nesting.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/admin")
    public ResponseEntity<String> postNesting(@RequestBody PostNestingRequest request) throws JsonProcessingException {
        Optional<Nesting> nesting = nestingService.postNesting(request);
        if (nesting.isPresent()) {
            String body = objectMapper.writeValueAsString(nesting.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.internalServerError().build();
    }

    @PutMapping("/admin")
    public ResponseEntity<String> putNesting(@RequestBody PutNestingRequest request) throws JsonProcessingException {
        Optional<Nesting> nesting = nestingService.putNesting(request);
        if (nesting.isPresent()) {
            String body = objectMapper.writeValueAsString(nesting.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin")
    public ResponseEntity<String> deleteNesting(@RequestParam UUID nestingId) {
        nestingService.deleteNesting(nestingId);
        return ResponseEntity.ok().build();
    }

}
