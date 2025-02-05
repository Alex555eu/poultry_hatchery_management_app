package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.service.EmergenceService;
import com.app.poultry_hatchery_management_app.service.HatchingService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/hatching")
public class HatchingController {

    private final ObjectMapper objectMapper;
    private final HatchingService hatchingService;
    private final EmergenceService emergenceService;

    @GetMapping("/by-task")
    public ResponseEntity<String> getHatchingByTaskId(@RequestParam UUID taskId) throws JsonProcessingException {
        Optional<Hatching> hatching = hatchingService.getHatchingByTaskId(taskId);
        if (hatching.isPresent()) {
            String response = objectMapper.writeValueAsString(hatching.get());
            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("")
    public ResponseEntity<String> getHatchingByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        Optional<Hatching> hatching = hatchingService.getHatchingByNestingId(nestingId);
        if(hatching.isPresent()) {
            String response = objectMapper.writeValueAsString(hatching.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/by-id")
    public ResponseEntity<String> getHatchingById(@RequestParam UUID hatchingId) throws JsonProcessingException {
        Optional<Hatching> hatching = hatchingService.getHatchingById(hatchingId);
        if(hatching.isPresent()) {
            String response = objectMapper.writeValueAsString(hatching.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<String> getAllHatchings() throws JsonProcessingException {
        List<Hatching> hatchings = hatchingService.getAllHatchings();
        if (hatchings == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if(!hatchings.isEmpty()) {
            String response = objectMapper.writeValueAsString(hatchings);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin")
    public ResponseEntity<String> postHatching(@RequestBody PostHatchingRequest request) throws JsonProcessingException {
        Optional<Hatching> hatching = hatchingService.postHatching(request);
        if(hatching.isPresent()) {
            String body = objectMapper.writeValueAsString(hatching.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/admin")
    public ResponseEntity<String> deleteHatching(@RequestParam UUID hatchingId) {
        hatchingService.deleteHatching(hatchingId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/loaded-deliveries")
    public ResponseEntity<String> getHatchingLoadedDeliveriesByHatchingId(@RequestParam UUID hatchingId) throws JsonProcessingException {
        List<HatchingLoadedDeliveries> hatching = hatchingService.getAllHatchingLoadedDeliveriesByHatchingId(hatchingId);
        if(hatching.isEmpty()) {
           return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(hatching);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/loaded-deliveries")
    public ResponseEntity<String> postHatchingLoadedDeliveries(@RequestBody PostHatchingLoadedDeliveryRequest request) {
        Optional<HatchingLoadedDeliveries> hatching = hatchingService.postHatchingLoadedDeliveries(request);
        if(hatching.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/admin/loaded-deliveries")
    public ResponseEntity<String> deleteHatchingLoadedDeliveries(@RequestParam UUID hatchingLoadedDeliveryId) {
        hatchingService.deleteHatchingLoadedDeliveries(hatchingLoadedDeliveryId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/result")
    public ResponseEntity<String> getAllHatchingResultsByHatchingId(@RequestParam UUID hatchingId) throws JsonProcessingException {
        List<HatchingResult> hatching = hatchingService.getAllHatchingResultsByHatchingId(hatchingId);
        if(hatching.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(hatching);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/result")
    public ResponseEntity<String> postHatchingResult(@RequestBody PostHatchingResultRequest request) {
        Optional<HatchingResult> result = hatchingService.postHatchingResult(request);
        if(result.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/result")
    public ResponseEntity<String> putHatchingResult(@RequestBody PutHatchingResultRequest request) {
        Optional<HatchingResult> result = hatchingService.putHatchingResult(request);
        if(result.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/result")
    public ResponseEntity<String> deleteHatchingResult(@RequestParam UUID hatchingResultId) {
        hatchingService.deleteHatchingResult(hatchingResultId);
        return ResponseEntity.ok().build();
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @GetMapping("/emergence/by-task")
    public ResponseEntity<String> getEmergenceByTaskId(@RequestParam UUID taskId) throws JsonProcessingException {
        Optional<Emergence> emergence = emergenceService.getEmergenceByTaskId(taskId);
        if (emergence.isPresent()) {
            String response = objectMapper.writeValueAsString(emergence.get());
            return ResponseEntity.ok(response);

        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin/emergence")
    public ResponseEntity<String> getAllEmergences() throws JsonProcessingException {
        List<Emergence> emergence = emergenceService.getAllEmergences();
        if(emergence.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(emergence);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/emergence/by-id")
    public ResponseEntity<String> getEmergenceById(@RequestParam UUID emergenceId) throws JsonProcessingException {
        Optional<Emergence> emergence = emergenceService.getEmergenceById(emergenceId);
        if(emergence.isPresent()) {
            String response = objectMapper.writeValueAsString(emergence.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/emergence")
    public ResponseEntity<String> postEmergence(@RequestBody PostEmergenceRequest request) throws JsonProcessingException {
        Optional<Emergence> emergence = emergenceService.postEmergence(request);
        if(emergence.isPresent()) {
            String response = objectMapper.writeValueAsString(emergence.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin/emergence")
    public ResponseEntity<String> deleteEmergence(@RequestParam UUID emergenceId) {
        emergenceService.deleteEmergence(emergenceId);
        return ResponseEntity.ok().build();
    }

}
