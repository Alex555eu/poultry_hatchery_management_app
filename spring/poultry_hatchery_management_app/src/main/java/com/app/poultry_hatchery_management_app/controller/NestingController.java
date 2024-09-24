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

    @GetMapping("/")
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

    @PostMapping("/")
    public ResponseEntity<String> postNesting(@RequestBody PostNestingRequest request) {
        Optional<Nesting> nesting = nestingService.postNesting(request);
        if (nesting.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.internalServerError().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putNesting(@RequestBody PutNestingRequest request) {
        Optional<Nesting> nesting = nestingService.putNesting(request);
        if (nesting.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteNesting(@RequestParam UUID nestingId) {
        nestingService.deleteNesting(nestingId);
        return ResponseEntity.ok().build();
    }

}
