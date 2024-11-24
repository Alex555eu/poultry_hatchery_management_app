package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.NestingLoadedDeliveriesRepository;
import com.app.poultry_hatchery_management_app.repository.NestingRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class NestingLoadedDeliveriesService {

    private final DeliveryRepository deliveryRepository;
    private final NestingRepository nestingRepository;
    private final NestingLoadedDeliveriesRepository nestingLoadedDeliveriesRepository;

    public Optional<NestingLoadedDeliveries> getNestingLoadedDeliveryById(UUID nestingLoadedDeliveryId) {
        return nestingLoadedDeliveriesRepository.findById(nestingLoadedDeliveryId);
    }

    public List<NestingLoadedDeliveries> getAllNestingLoadedDeliveries() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return nestingLoadedDeliveriesRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return List.of();
    }

    public List<NestingLoadedDeliveries> getAllNestingLoadedDeliveriesByNestingId(UUID nestingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return nestingLoadedDeliveriesRepository.findAllByNestingId(nestingId);
        }
        return List.of();
    }

    public Optional<NestingLoadedDeliveries> postNestingLoadedDelivery(UUID nestingId, UUID deliveryId, Integer quantity) {
        Optional<Nesting> nesting = nestingRepository.findById(nestingId);
        Optional<Delivery> delivery = deliveryRepository.findById(deliveryId);
        if (delivery.isPresent() && nesting.isPresent()) {
            NestingLoadedDeliveries nld = NestingLoadedDeliveries.builder()
                    .nesting(nesting.get())
                    .delivery(delivery.get())
                    .quantity(quantity)
                    .build();
            nestingLoadedDeliveriesRepository.save(nld);
            return Optional.of(nld);
        }
        return Optional.empty();
    }

    public void deleteNestingLoadedDelivery(UUID nestingLoadedDeliveryId) {
        nestingLoadedDeliveriesRepository.deleteById(nestingLoadedDeliveryId);
    }



}
