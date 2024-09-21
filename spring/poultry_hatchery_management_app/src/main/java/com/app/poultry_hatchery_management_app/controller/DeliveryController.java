package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PutDeliveryRequest;
import com.app.poultry_hatchery_management_app.service.DeliveryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/")
    public ResponseEntity<String> getAllDeliveries() throws JsonProcessingException {
        return deliveryService.getAllDeliveries();
    }


    @GetMapping("/by-id")
    public ResponseEntity<String> getDeliveryById(@RequestParam("id") UUID deliveryId) throws JsonProcessingException {
        return deliveryService.getDeliveryById(deliveryId);
    }


    @GetMapping("/by-supplier")
    public ResponseEntity<String> getDeliveriesBySupplierId(@RequestParam("id") UUID supplierId) throws JsonProcessingException {
        return deliveryService.getDeliveriesBySupplierId(supplierId);
    }

    @PostMapping
    public ResponseEntity<String> postDelivery(@RequestBody PostDeliveryRequest request) {
        return deliveryService.postDelivery(request);
    }


    @PutMapping
    public ResponseEntity<String> putDelivery(@RequestBody PutDeliveryRequest request) {
        return deliveryService.putDelivery(request);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteDelivery(@RequestParam("id") UUID deliveryID) {
        return deliveryService.deleteDelivery(deliveryID);
    }



}
