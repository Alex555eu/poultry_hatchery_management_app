package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("spring/v1/deliveries")
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;

  /*  @GetMapping("/")
    public ResponseEntity<List<DeliveryResponse>> getAllDeliveries() {
        //todo: implementation
        return null;
    }
*/
    @GetMapping("/by-id")
    public ResponseEntity<Delivery> getDeliveryById(@RequestParam("id") UUID deliveryId) {
        Optional<Delivery> delivery = deliveryRepository.findById(deliveryId);

        return delivery.isPresent() ? ResponseEntity.ok(delivery.get()) : ResponseEntity.notFound().build();
    }
/*
    @GetMapping("/by-supplier")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesBySupplierId(@RequestParam("id") UUID supplierId) {
        //todo: implementation
        return null;
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<DeliveryResponse>> getDeliveriesByDate(@RequestParam("date") LocalDateTime dateTime) {
        //todo: implementation
        return null;
    }*/



}
