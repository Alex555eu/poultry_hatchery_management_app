package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostEmergenceRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.EmergenceRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingResultRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@AllArgsConstructor
@Service
public class EmergenceService {

    private final EmergenceRepository emergenceRepository;
    private final HatchingResultRepository hatchingResultRepository;

    private final NestingService nestingService;
    private final HatchingService hatchingService;
    private final TaskService taskService;
    private final HatchingTrolleyService hatchingTrolleyService;

    public Optional<Emergence> getEmergenceByTaskId(UUID taskId) {
        return emergenceRepository.findByTaskId(taskId);
    }
    public List<Emergence> getAllEmergences() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return emergenceRepository.findAll(user.getOrganisation().getId());
        }
        return List.of();
    }

    public Optional<Emergence> getEmergenceById(UUID emergenceId) {
        return emergenceRepository.findById(emergenceId);
    }

    public Optional<Emergence> getEmergenceByNestingId(UUID nestingId) {
        return emergenceRepository.findEmergenceByNestingId(nestingId);
    }
    @Transactional
    public Optional<Emergence> postEmergence(PostEmergenceRequest request) {
        Optional<Nesting> nestingOpt = nestingService.getNesting(request.nestingId());
        Optional<Hatching> hatchingOpt = hatchingService.getHatchingByNestingId(nestingOpt.get().getId());
        Optional<Task> taskOpt = taskService.getTaskById(request.taskId());

        if (hatchingOpt.isPresent() && taskOpt.isPresent()) {
            Hatching hatching = hatchingOpt.get();
            Task task = taskOpt.get();

            List<HatchingTrolleyContent> allHatchingContents = hatchingTrolleyService.getHatchingTrolleysContentByHatchingId(hatching.getId());
            Map<HatchingLoadedDeliveries, List<HatchingTrolleyContent>> mapping = new HashMap<>();

            for (HatchingTrolleyContent content : allHatchingContents) {
                HatchingLoadedDeliveries key = content.getHatchingLoadedDeliveries();
                mapping.computeIfAbsent(key, k -> new ArrayList<>()).add(content);
            }

            for (HatchingLoadedDeliveries hld : mapping.keySet()) {
                HatchingResult result = HatchingResult.builder()
                        .hatchingLoadedDeliveries(hld)
                        .quantity(mapping.getOrDefault(hld, Collections.emptyList())
                                .stream()
                                .mapToInt(HatchingTrolleyContent::getQuantity)
                                .sum())

                        .build();
                hatchingResultRepository.save(result);
            }

            Emergence emergence = Emergence.builder()
                    .dateTime(LocalDateTime.now())
                    .hatching(hatching)
                    .task(task)
                    .build();
            emergenceRepository.save(emergence);

            return Optional.of(emergence);
        }
        return Optional.empty();
    }

    public void deleteEmergence(UUID emergenceId) {
        emergenceRepository.deleteById(emergenceId);
    }




}
