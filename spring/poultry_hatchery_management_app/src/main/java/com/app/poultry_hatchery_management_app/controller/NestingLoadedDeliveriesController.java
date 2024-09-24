package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.model.NestingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.service.NestingLoadedDeliveriesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting-loaded-deliveries")
public class NestingLoadedDeliveriesController {

    private final NestingLoadedDeliveriesService nestingLoadedDeliveriesService;

    @PostMapping
    public ResponseEntity<String> postNestingLoadedDelivery(@RequestParam UUID nestingId, UUID deliveryId) {
        Optional<NestingLoadedDeliveries> nld = nestingLoadedDeliveriesService.postNestingLoadedDelivery(nestingId, deliveryId);
        if (nld.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<String> deleteNestingLoadedDelivery(@RequestParam UUID nestingLoadedDeliveryId) {
        nestingLoadedDeliveriesService.deleteNestingLoadedDelivery(nestingLoadedDeliveryId);
        return ResponseEntity.ok().build();
    }

}
