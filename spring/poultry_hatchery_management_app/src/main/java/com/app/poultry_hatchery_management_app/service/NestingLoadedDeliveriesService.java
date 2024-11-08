package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.NestingLoadedDeliveriesRepository;
import com.app.poultry_hatchery_management_app.repository.NestingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    public Optional<NestingLoadedDeliveries> postNestingLoadedDelivery(UUID nestingId, UUID deliveryId) {
        Optional<Nesting> nesting = nestingRepository.findById(nestingId);
        Optional<Delivery> delivery = deliveryRepository.findById(deliveryId);
        if (delivery.isPresent() && nesting.isPresent()) {
            NestingLoadedDeliveries nld = NestingLoadedDeliveries.builder()
                    .nesting(nesting.get())
                    .delivery(delivery.get())
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
