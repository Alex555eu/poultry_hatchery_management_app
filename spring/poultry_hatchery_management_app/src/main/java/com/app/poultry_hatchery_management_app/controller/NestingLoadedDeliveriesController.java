package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.model.NestingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.service.NestingLoadedDeliveriesService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting-loaded-deliveries")
public class NestingLoadedDeliveriesController {

    private final NestingLoadedDeliveriesService nestingLoadedDeliveriesService;
    private final ObjectMapper objectMapper;


    @GetMapping("")
    public ResponseEntity<String> getAllNestingLoadedDeliveries() throws JsonProcessingException {
        List<NestingLoadedDeliveries> nld = nestingLoadedDeliveriesService.getAllNestingLoadedDeliveries();
        if (nld.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String body = objectMapper.writeValueAsString(nld);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/nesting")
    public ResponseEntity<String> getAllNestingLoadedDeliveriesByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<NestingLoadedDeliveries> nld = nestingLoadedDeliveriesService.getAllNestingLoadedDeliveriesByNestingId(nestingId);
        if (nld.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String body = objectMapper.writeValueAsString(nld);
        return ResponseEntity.ok(body);
    }

    @PostMapping("")
    public ResponseEntity<String> postNestingLoadedDelivery(@RequestParam UUID nestingId, UUID deliveryId, Integer quantity) {
        Optional<NestingLoadedDeliveries> nld = nestingLoadedDeliveriesService.postNestingLoadedDelivery(nestingId, deliveryId, quantity);
        if (nld.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("")
    public ResponseEntity<String> deleteNestingLoadedDelivery(@RequestParam UUID nestingLoadedDeliveryId) {
        nestingLoadedDeliveriesService.deleteNestingLoadedDelivery(nestingLoadedDeliveryId);
        return ResponseEntity.ok().build();
    }

}
