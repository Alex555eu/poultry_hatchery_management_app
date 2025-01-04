package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PostHatchingLoadedDeliveryRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingResultRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingResultRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.HatchingLoadedDeliveriesRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingResultRepository;
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
public class HatchingService {

    private final HatchingRepository hatchingRepository;
    private final HatchingLoadedDeliveriesRepository hatchingLoadedDeliveriesRepository;
    private final HatchingResultRepository hatchingResultRepository;

    private final NestingService nestingService;
    private final DeliveryService deliveryService;
    private final TaskService taskService;

    public Optional<Hatching> getHatchingByNestingId(UUID nestingId) {
        return hatchingRepository.findByNestingId(nestingId);
    }

    public List<Hatching> getAllHatchings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            List<Nesting> nestings = this.nestingService.getAllNestings();

            if (!nestings.isEmpty())
                return hatchingRepository.findAllByNestings(nestings);
        }
        return null;
    }

    public Optional<Hatching> postHatching(PostHatchingRequest request) {
        Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());
        Optional<Task> task = taskService.getTaskById(request.taskId());
        if (nesting.isPresent() && task.isPresent()){
            Hatching hatching = Hatching.builder()
                    .dateTime(LocalDateTime.now())
                    .nesting(nesting.get())
                    .task(task.get())
                    .build();
        hatchingRepository.save(hatching);

        return Optional.of(hatching);
        }
        return Optional.empty();
    }

    public void deleteHatching(UUID hatchingId) {
        hatchingRepository.deleteById(hatchingId);
    }

    public List<HatchingLoadedDeliveries> getAllHatchingLoadedDeliveriesByHatchingId(UUID hatchingId) {
        Optional<Hatching> hatching = hatchingRepository.findById(hatchingId);
        if (hatching.isPresent()) {
            return hatchingLoadedDeliveriesRepository.findAllByHatchingId(hatchingId);
        }
        return List.of();
    }

    public Optional<HatchingLoadedDeliveries> getHatchingLoadedDeliveryById(UUID hatchingLoadedDeliveryId) {
        return hatchingLoadedDeliveriesRepository.findById(hatchingLoadedDeliveryId);
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

    public List<HatchingResult> getAllHatchingResultsByHatchingId(UUID hatchingId) {
        return hatchingResultRepository.findAllByHatchingId(hatchingId);
    }

    public Optional<HatchingResult> getHatchingResultsById(UUID hatchingResultId) {
        return hatchingResultRepository.findById(hatchingResultId);
    }

    public Optional<HatchingResult> postHatchingResult(PostHatchingResultRequest request) {
        Optional<HatchingLoadedDeliveries> hld = getHatchingLoadedDeliveryById(request.hatchingLoadedDeliveryId());
        if (hld.isPresent()) {
            HatchingResult result = HatchingResult.builder()
                    .hatchingLoadedDeliveries(hld.get())
                    .quantity(request.quantity())
                    .build();
            hatchingResultRepository.save(result);

            return Optional.of(result);
        }
        return Optional.empty();
    }

    public Optional<HatchingResult> putHatchingResult(PutHatchingResultRequest request) {
        Optional<HatchingResult> result = hatchingResultRepository.findById(request.hatchingResultId());
        if (result.isPresent()) {
            result.get().setQuantity(request.quantity());
            hatchingResultRepository.save(result.get());

            return result;
        }
        return Optional.empty();
    }

    public void deleteHatchingResult(UUID hatchingResultId) {
        hatchingResultRepository.deleteById(hatchingResultId);
    }

}
