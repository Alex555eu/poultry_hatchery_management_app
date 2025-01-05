package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.PostHatchingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.HatchingTrolley;
import com.app.poultry_hatchery_management_app.model.HatchingTrolleyContent;
import com.app.poultry_hatchery_management_app.service.HatchingTrolleyService;
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
@RequestMapping("/api/v1/hatching-trolley")
public class HatchingTrolleyController {

    private final ObjectMapper objectMapper;
    private final HatchingTrolleyService hatchingTrolleyService;

    @GetMapping("")
    public ResponseEntity<String> getAllHatchingTrolleys() throws JsonProcessingException {
        List<HatchingTrolley> trolleys = hatchingTrolleyService.getAllHatchingTrolleys();
        if (trolleys == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (trolleys.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(trolleys);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unused")
    public ResponseEntity<String> getAllUnusedHatchingTrolleys() throws JsonProcessingException {
        List<HatchingTrolley> trolleys = hatchingTrolleyService.getAllUnusedHatchingTrolleys();
        if (trolleys == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (trolleys.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        String response = objectMapper.writeValueAsString(trolleys);
        return ResponseEntity.ok(response);
    }
    @PostMapping("")
    public ResponseEntity<String> postHatchingTrolley(@RequestBody PostHatchingTrolleyRequest request) {
        Optional<HatchingTrolley> trolley = hatchingTrolleyService.postHatchingTrolley(request);
        if (trolley.isPresent()) {
            return  ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("")
    public ResponseEntity<String> putHatchingTrolley(@RequestBody PutHatchingTrolleyRequest request) {
        Optional<HatchingTrolley> trolley = hatchingTrolleyService.putHatchingTrolley(request);
        if (trolley.isPresent()) {
            return  ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("")
    public ResponseEntity<String> deleteHatchingTrolley(@RequestParam UUID hatchingTrolleyId) {
        hatchingTrolleyService.deleteHatchingTrolley(hatchingTrolleyId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/content")
    public ResponseEntity<String> getHatchingTrolleysContent(@RequestParam UUID hatchingTrolleyId) throws JsonProcessingException {
        Optional<HatchingTrolleyContent> content = hatchingTrolleyService.getHatchingTrolleysContent(hatchingTrolleyId);
        if (content.isPresent()) {
            String response = objectMapper.writeValueAsString(content.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/content/by-hatching")
    public ResponseEntity<String> getHatchingTrolleysContentByHatchingId(@RequestParam UUID hatchingId) throws JsonProcessingException {
        List<HatchingTrolleyContent> content = hatchingTrolleyService.getHatchingTrolleysContentByHatchingId(hatchingId);
        if (!content.isEmpty()) {
            String response = objectMapper.writeValueAsString(content);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/content")
    public ResponseEntity<String> postHatchingTrolleyContent(@RequestBody PostHatchingTrolleyContentRequest request) {
        Optional<HatchingTrolleyContent> content = hatchingTrolleyService.postHatchingTrolleyContent(request);
        if (content.isPresent()) {
            return  ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/content")
    public ResponseEntity<String> putHatchingTrolleyContent(@RequestBody PutHatchingTrolleyContentRequest request) {
        Optional<HatchingTrolleyContent> content = hatchingTrolleyService.putHatchingTrolleyContent(request);
        if (content.isPresent()) {
            return  ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/content")
    public ResponseEntity<String> deleteHatchingTrolleyContent(@RequestParam UUID hatchingTrolleyContentId) {
        hatchingTrolleyService.deleteHatchingTrolleyContent(hatchingTrolleyContentId);
        return ResponseEntity.ok().build();
    }


}
