package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PostHatchingLoadedDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingRequest;
import com.app.poultry_hatchery_management_app.model.Delivery;
import com.app.poultry_hatchery_management_app.model.Hatching;
import com.app.poultry_hatchery_management_app.model.HatchingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.repository.HatchingLoadedDeliveriesRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class HatchingService {

    private final HatchingRepository hatchingRepository;
    private final HatchingLoadedDeliveriesRepository hatchingLoadedDeliveriesRepository;

    private final NestingService nestingService;
    private final DeliveryService deliveryService;

    public Optional<Hatching> getHatchingByNestingId(UUID nestingId) {
        return hatchingRepository.findByNestingId(nestingId);
    }

    public Optional<Hatching> postHatching(PostHatchingRequest request) {
        Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());
        if (nesting.isPresent()){
            Hatching hatching = Hatching.builder()
                    .dateTime(LocalDateTime.now())
                    .nesting(nesting.get())
                    .build();
        hatchingRepository.save(hatching);

        return Optional.of(hatching);
        }
        return Optional.empty();
    }

    public void deleteHatching(UUID hatchingId) {
        hatchingRepository.deleteById(hatchingId);
    }

    public List<HatchingLoadedDeliveries> getHatchingLoadedDeliveriesByHatchingId(UUID hatchingId) {
        Optional<Hatching> hatching = hatchingRepository.findById(hatchingId);
        if (hatching.isPresent()) {
            return hatchingLoadedDeliveriesRepository.findAllByHatchingId(hatchingId);
        }
        return List.of();
    }

    public Optional<HatchingLoadedDeliveries> postHatchingLoadedDeliveries(PostHatchingLoadedDeliveryRequest request) {
        Optional<Hatching> hatching = hatchingRepository.findById(request.hatchingId());
        Optional<Delivery> delivery = deliveryService.getDeliveryById(request.deliveryId());

        if (hatching.isPresent() && delivery.isPresent()) {
            HatchingLoadedDeliveries hld = HatchingLoadedDeliveries.builder()
                    .hatching(hatching.get())
                    .delivery(delivery.get())
                    .build();
            hatchingLoadedDeliveriesRepository.save(hld);
            return Optional.of(hld);
        }
        return Optional.empty();
    }

    public void deleteHatchingLoadedDeliveries(UUID hatchingLoadedDeliveryId) {
        hatchingLoadedDeliveriesRepository.deleteById(hatchingLoadedDeliveryId);
    }

}
