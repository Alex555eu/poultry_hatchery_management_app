package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostHatchingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.HatchingLoadedDeliveries;
import com.app.poultry_hatchery_management_app.model.HatchingTrolley;
import com.app.poultry_hatchery_management_app.model.HatchingTrolleyContent;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.HatchingTrolleyContentRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingTrolleyRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class HatchingTrolleyService {

    private final HatchingTrolleyRepository hatchingTrolleyRepository;
    private final HatchingTrolleyContentRepository hatchingTrolleyContentRepository;

    private final HatchingService hatchingService;

    public List<HatchingTrolley> getAllHatchingTrolleys() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();
            return hatchingTrolleyRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return null;
    }

    public List<HatchingTrolley> getAllUnusedHatchingTrolleys() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();
            return hatchingTrolleyRepository.findAllUnusedHatchingTrolleys(user.getOrganisation().getId());
        }
        return null;
    }
    public Optional<HatchingTrolley> getHatchingTrolleyById(UUID hatchingTrolleyId) {
        return hatchingTrolleyRepository.findById(hatchingTrolleyId);
    }

    public Optional<HatchingTrolley> postHatchingTrolley(PostHatchingTrolleyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            HatchingTrolley trolley = HatchingTrolley.builder()
                    .organisation(user.getOrganisation())
                    .humanReadableId(request.humanReadableId())
                    .build();
            hatchingTrolleyRepository.save(trolley);
            return Optional.of(trolley);
        }
        return Optional.empty();
    }

    public Optional<HatchingTrolley> putHatchingTrolley(PutHatchingTrolleyRequest request) {
        Optional<HatchingTrolley> trolley = hatchingTrolleyRepository.findById(request.hatchingTrolleyId());
        if (trolley.isPresent()) {
            trolley.get().setHumanReadableId(request.humanReadableId());
            hatchingTrolleyRepository.save(trolley.get());

            return trolley;
        }
        return Optional.empty();
    }

    public void deleteHatchingTrolley(UUID hatchingTrolleyId) {
        hatchingTrolleyRepository.deleteById(hatchingTrolleyId);
    }

    public Optional<HatchingTrolleyContent> getHatchingTrolleysContent(UUID hatchingTrolleyId) {
        return hatchingTrolleyContentRepository.findByHatchingTrolleyId(hatchingTrolleyId);
    }


    public List<HatchingTrolleyContent> getHatchingTrolleysContentByHatchingId(UUID hatchingId) {
        return hatchingTrolleyContentRepository.findByHatchingId(hatchingId);
    }
    public Optional<HatchingTrolleyContent> postHatchingTrolleyContent(PostHatchingTrolleyContentRequest request) {
        Optional<HatchingTrolley> trolley = hatchingTrolleyRepository.findById(request.hatchingTrolleyId());
        Optional<HatchingLoadedDeliveries> hld = hatchingService.getHatchingLoadedDeliveryById(request.hatchingLoadedDeliveriesId());

        if (trolley.isPresent() && hld.isPresent()) {
            HatchingTrolleyContent content = HatchingTrolleyContent.builder()
                    .hatchingTrolley(trolley.get())
                    .hatchingLoadedDeliveries(hld.get())
                    .quantity(request.quantity())
                    .build();
            hatchingTrolleyContentRepository.save(content);

            return Optional.of(content);
        }
        return Optional.empty();
    }

    public Optional<HatchingTrolleyContent> putHatchingTrolleyContent(PutHatchingTrolleyContentRequest request) {
        Optional<HatchingTrolleyContent> content = hatchingTrolleyContentRepository.findById(request.hatchingTrolleyContentId());
        Optional<HatchingLoadedDeliveries> hld = hatchingService.getHatchingLoadedDeliveryById(request.hatchingLoadedDeliveriesId());
        if (content.isPresent() && hld.isPresent()) {
            content.get().setQuantity(request.quantity());
            content.get().setHatchingLoadedDeliveries(hld.get());
            hatchingTrolleyContentRepository.save(content.get());

            return content;
        }
        return  Optional.empty();
    }

    public void deleteHatchingTrolleyContent(UUID hatchingTrolleyContentId) {
        hatchingTrolleyContentRepository.deleteById(hatchingTrolleyContentId);
    }




}
