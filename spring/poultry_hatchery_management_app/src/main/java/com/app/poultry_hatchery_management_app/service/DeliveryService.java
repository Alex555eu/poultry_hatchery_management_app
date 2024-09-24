package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PutDeliveryRequest;
import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.Supplier;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.SupplierRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.AllArgsConstructor;
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

    public List<Delivery> getAllDeliveries() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return deliveryRepository.findByUserId(user.getId());
        }
        return null;
    }

    public Optional<Delivery> getDeliveryById(UUID id) {
        return deliveryRepository.findById(id);
    }

    public List<Delivery> getDeliveriesBySupplierId(UUID supplierId) {
        return deliveryRepository.findBySupplierId(supplierId);
    }

    public Optional<Delivery> postDelivery(PostDeliveryRequest request) {
        Optional<Supplier> supplier = supplierRepository.findById(request.supplierId());
        if (supplier.isPresent()) {
            Delivery newDelivery = Delivery.builder()
                    .dateTime(LocalDateTime.now())
                    .supplier(supplier.get())
                    .quantity(request.quantity())
                    .build();
            deliveryRepository.save(newDelivery);

            return Optional.of(newDelivery);
        }
        return Optional.empty();
    }

    public Optional<Delivery> putDelivery(PutDeliveryRequest request) {
        Optional<Delivery> delivery = deliveryRepository.findById(request.deliveryId());
        if (delivery.isPresent()) {
            delivery.get().setQuantity(request.quantity());
            deliveryRepository.save(delivery.get());

            return delivery;
        }
        return Optional.empty();
    }

    public void deleteDelivery(UUID id) {
        deliveryRepository.deleteById(id);
    }


}
