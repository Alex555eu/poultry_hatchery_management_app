package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.PostHatchingLoadedDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingRequest;
import com.app.poultry_hatchery_management_app.model.Hatching;
import com.app.poultry_hatchery_management_app.model.HatchingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.service.HatchingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/hatching")
public class HatchingController {

    private final ObjectMapper objectMapper;
    private final HatchingService hatchingService;

    @GetMapping("/")
    public ResponseEntity<String> getHatchingByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        Optional<Hatching> hatching = hatchingService.getHatchingByNestingId(nestingId);
        if(hatching.isPresent()) {
            String response = objectMapper.writeValueAsString(hatching.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<String> postHatching(@RequestBody PostHatchingRequest request) {
        Optional<Hatching> hatching = hatchingService.postHatching(request);
        if(hatching.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/")
    public ResponseEntity<String> deleteHatching(@RequestParam UUID hatchingId) {
        hatchingService.deleteHatching(hatchingId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/loaded-deliveries")
    public ResponseEntity<String> getHatchingLoadedDeliveriesByHatchingId(@RequestParam UUID hatchingId) throws JsonProcessingException {
        List<HatchingLoadedDeliveries> hatching = hatchingService.getHatchingLoadedDeliveriesByHatchingId(hatchingId);
        if(hatching.isEmpty()) {
           return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(hatching);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/loaded-deliveries")
    public ResponseEntity<String> postHatchingLoadedDeliveries(@RequestBody PostHatchingLoadedDeliveryRequest request) {
        Optional<HatchingLoadedDeliveries> hatching = hatchingService.postHatchingLoadedDeliveries(request);
        if(hatching.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/loaded-deliveries")
    public ResponseEntity<String> deleteHatchingLoadedDeliveries(@RequestParam UUID hatchingLoadedDeliveryId) {
        hatchingService.deleteHatchingLoadedDeliveries(hatchingLoadedDeliveryId);
        return ResponseEntity.ok().build();
    }


}
