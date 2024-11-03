package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PostSupplierRequest;
import com.app.poultry_hatchery_management_app.dto.PutDeliveryRequest;
import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.ProductType;
import com.app.poultry_hatchery_management_app.model.Supplier;
import com.app.poultry_hatchery_management_app.service.DeliveryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final ObjectMapper objectMapper;

    @GetMapping("/")
    public ResponseEntity<String> getAllDeliveries() throws JsonProcessingException {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        if (deliveries == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (deliveries.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(deliveries);
            return ResponseEntity.ok(response);
        }
    }


    @GetMapping("/by-id")
    public ResponseEntity<String> getDeliveryById(@RequestParam("id") UUID deliveryId) throws JsonProcessingException {
        Optional<Delivery> delivery = deliveryService.getDeliveryById(deliveryId);

        if (delivery.isPresent()) {
            String response = objectMapper.writeValueAsString(delivery.get());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/by-supplier")
    public ResponseEntity<String> getDeliveriesBySupplierId(@RequestParam("id") UUID supplierId) throws JsonProcessingException {
        List<Delivery> deliveries = deliveryService.getDeliveriesBySupplierId(supplierId);
        if (deliveries.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(deliveries);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product-types-all")
    public ResponseEntity<String> getAllProductTypes() throws JsonProcessingException {
        List<String> types = deliveryService.getAllProductTypes();
        if (types.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(types);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<String> postDelivery(@RequestBody PostDeliveryRequest request) throws JsonProcessingException {
        try {
            Optional<Delivery> delivery = deliveryService.postDelivery(request);
            if (delivery.isPresent()) {
                String body = objectMapper.writeValueAsString(delivery.get());
                return ResponseEntity.ok(body);
            }
            return ResponseEntity.notFound().build();
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }


    @PutMapping
    public ResponseEntity<String> putDelivery(@RequestBody PutDeliveryRequest request) {
        try {
            Optional<Delivery> delivery = deliveryService.putDelivery(request);
            if (delivery.isPresent()) {
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteDelivery(@RequestParam("id") UUID deliveryID) {
        deliveryService.deleteDelivery(deliveryID);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/supplier")
    public ResponseEntity<String> getAllSuppliers() throws JsonProcessingException {
        List<Supplier> suppliers = deliveryService.getAllSuppliers();
        if (suppliers == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (suppliers.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(suppliers);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/supplier")
    public ResponseEntity<String> postSupplier(@RequestBody PostSupplierRequest request) throws JsonProcessingException {
        Optional<Supplier> supplier;
        try {
            supplier = deliveryService.postSupplier(request);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if (supplier.isPresent()) {
            String body = objectMapper.writeValueAsString(supplier.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}
