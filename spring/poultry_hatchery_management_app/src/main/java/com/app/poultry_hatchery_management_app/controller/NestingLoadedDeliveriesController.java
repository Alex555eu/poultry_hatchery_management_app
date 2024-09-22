package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.service.NestingLoadedDeliveriesService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/nesting-loaded-deliveries")
public class NestingLoadedDeliveriesController {

    private final NestingLoadedDeliveriesService nestingLoadedDeliveriesService;

    @PostMapping
    public ResponseEntity<String> postNestingLoadedDelivery(@RequestParam UUID nestingId, UUID deliveryId) {
        return nestingLoadedDeliveriesService.postNestingLoadedDelivery(nestingId, deliveryId);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteNestingLoadedDelivery(@RequestParam UUID nestingLoadedDeliveryId) {
        return nestingLoadedDeliveriesService.deleteNestingLoadedDelivery(nestingLoadedDeliveryId);
    }

}
