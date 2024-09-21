package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PutDeliveryRequest;
import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.Supplier;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.SupplierRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final SupplierRepository supplierRepository;
    private final ObjectMapper objectMapper;

    public ResponseEntity<String> getDeliveryById(UUID id) throws JsonProcessingException {
        Optional<Delivery> delivery = deliveryRepository.findById(id);
        if (delivery.isPresent()) {
            String body = objectMapper.writeValueAsString(delivery.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> getAllDeliveries() throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            List<Delivery> result = deliveryRepository.findByUserId(user.getId());

            if (result != null && !result.isEmpty()) {
                String responseBody = objectMapper.writeValueAsString(result);
                return ResponseEntity.ok(responseBody);
            }
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public ResponseEntity<String> getDeliveriesBySupplierId(UUID supplierId) throws JsonProcessingException {
        List<Delivery> result = deliveryRepository.findBySupplierId(supplierId);
        if (result != null && !result.isEmpty()) {
            String responseBody = objectMapper.writeValueAsString(result);
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> postDelivery(PostDeliveryRequest request) {
        Optional<Supplier> supplier = supplierRepository.findById(request.supplierId());
        if (supplier.isPresent()) {
            Delivery newDelivery = Delivery.builder()
                    .dateTime(LocalDateTime.now())
                    .supplier(supplier.get())
                    .quantity(request.quantity())
                    .build();
            deliveryRepository.save(newDelivery);

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> putDelivery(PutDeliveryRequest request) {
        Optional<Delivery> delivery = deliveryRepository.findById(request.deliveryId());
        if (delivery.isPresent()) {
            delivery.get().setQuantity(request.quantity());
            deliveryRepository.save(delivery.get());

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> deleteDelivery(UUID id) {
        deliveryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
