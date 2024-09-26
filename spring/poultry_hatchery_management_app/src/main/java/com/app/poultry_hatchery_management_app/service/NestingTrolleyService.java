package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.NestingLoadedDeliveriesRepository;
import com.app.poultry_hatchery_management_app.repository.NestingTrolleyContentRepository;
import com.app.poultry_hatchery_management_app.repository.NestingTrolleyRepository;
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
public class NestingTrolleyService {

    private final NestingTrolleyRepository nestingTrolleyRepository;
    private final NestingTrolleyContentRepository nestingTrolleyContentRepository;
    private final NestingLoadedDeliveriesRepository nestingLoadedDeliveriesRepository;

    public List<NestingTrolley> getAllTrolleys() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            return nestingTrolleyRepository.findAllByOrganisationId(organisation.getId());
        }
        return null;
    }

    public Optional<NestingTrolley> getTrolleyById(UUID nestingTrolleyId) {
        return nestingTrolleyRepository.findById(nestingTrolleyId);
    }


    public Optional<NestingTrolley> postTrolley(PostNestingTrolleyRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            NestingTrolley nestingTrolley = NestingTrolley.builder()
                    .humanReadableId(request.humanReadableId())
                    .maxCapacity(request.maxCapacity())
                    .organisation(organisation)
                    .availableCapacity(request.maxCapacity())
                    .build();
            nestingTrolleyRepository.save(nestingTrolley);

            return Optional.of(nestingTrolley);
        }
        return Optional.empty();
    }

    public Optional<NestingTrolley> putTrolley(PutNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(request.trolleyId());

        if (trolley.isPresent()) {
            trolley.get().setAvailableCapacity(request.availableCapacity());
            trolley.get().setMaxCapacity(request.maxCapacity());
            trolley.get().setHumanReadableId(request.humanReadableId());

            nestingTrolleyRepository.save(trolley.get());

            return trolley;
        }
        return Optional.empty();
    }

    public void deleteTrolley(UUID trolleyId) {
        nestingTrolleyRepository.deleteById(trolleyId);
    }


    public List<NestingTrolleyContent> getNestingTrolleyContent(UUID nestingTrolleyId) {
        return nestingTrolleyContentRepository.findAllByNestingTrolleyId(nestingTrolleyId);
    }

    public Optional<NestingTrolleyContent> postTrolleyContent(PostNestingTrolleyContentRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(request.nestingTrolleyId());
            Optional<NestingLoadedDeliveries> loadedDeliveries = nestingLoadedDeliveriesRepository.findById(request.nestingLoadedDeliveriesId());

            if (trolley.isPresent() && loadedDeliveries.isPresent()) {
                if (trolley.get().getOrganisation().equals(organisation)) {

                    NestingTrolleyContent content = NestingTrolleyContent.builder()
                            .nestingLoadedDeliveries(loadedDeliveries.get())
                            .nestingTrolley(trolley.get())
                            .quantity(request.quantity())
                            .build();
                    nestingTrolleyContentRepository.save(content);

                    return Optional.of(content);
                }
            }
        }
        return Optional.empty();
    }

    public Optional<NestingTrolleyContent> putTrolleyContent(PutNestingTrolleyContentRequest request) {
        Optional<NestingTrolleyContent> content = nestingTrolleyContentRepository.findById(request.contentId());
            if (content.isPresent()) {
                content.get().setQuantity(request.quantity());
                nestingTrolleyContentRepository.save(content.get());

                return content;
            }
        return Optional.empty();
    }

    public void deleteTrolleyContent(UUID trolleyContentId) {
        nestingTrolleyContentRepository.deleteById(trolleyContentId);
    }



}
