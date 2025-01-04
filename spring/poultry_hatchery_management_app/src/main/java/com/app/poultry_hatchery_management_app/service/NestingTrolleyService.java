package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
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

    public List<NestingTrolley> getAllTrolleysFromOutsideOfIncubators() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            return nestingTrolleyRepository.findAllTrolleysOutsideOfIncubators(organisation.getId());
        }
        return null;
    }

    public Optional<NestingTrolley> getTrolleyById(UUID nestingTrolleyId) {
        return nestingTrolleyRepository.findById(nestingTrolleyId);
    }

    public List<NestingTrolley> getAllTrolleysByNestingId(UUID nestingId) {
        return nestingTrolleyRepository.findAllTrolleysByNestingId(nestingId);
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
                    .build();
            nestingTrolleyRepository.save(nestingTrolley);

            return Optional.of(nestingTrolley);
        }
        return Optional.empty();
    }

    public Optional<NestingTrolley> putTrolley(PutNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(request.trolleyId());

        if (trolley.isPresent()) {
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

    public List<NestingTrolleyContent> getNestingTrolleyContentByNestingId(UUID nestingId) {
        return nestingTrolleyContentRepository.findAllByNestingId(nestingId);
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

    public List<NestingTrolleyContent> postTrolleyContentTransfer(PostNestingTrolleyContentTransferRequest request) {
        Optional<NestingTrolley> targetTrolleyOpt = nestingTrolleyRepository.findById(request.targetNestingTrolleyId());
        Optional<NestingTrolleyContent> sourceContentOpt = nestingTrolleyContentRepository.findById(request.sourceNestingTrolleyContentId());

        if (targetTrolleyOpt.isPresent() &&
                sourceContentOpt.isPresent() &&
                request.quantity() <= sourceContentOpt.get().getQuantity())

        {
            NestingTrolleyContent sourceContent = sourceContentOpt.get();
            NestingTrolley targetTrolley = targetTrolleyOpt.get();

            List<NestingTrolleyContent> targetTrolleyContentList = nestingTrolleyContentRepository.findAllByNestingTrolleyId(targetTrolley.getId());

            Integer currentAmount = targetTrolleyContentList.stream().mapToInt(NestingTrolleyContent::getQuantity).reduce(0, Integer::sum);

            if (request.quantity() <= (targetTrolley.getMaxCapacity() - currentAmount)) {
                // check, if targeted trolley already contains content from the same delivery
                Optional<NestingTrolleyContent> existingContentOpt = targetTrolleyContentList
                        .stream()
                        .filter(it -> it.getNestingLoadedDeliveries().getId().equals(sourceContent.getNestingLoadedDeliveries().getId()))
                        .findAny();

                // append existing content
                NestingTrolleyContent targetContent;
                if (existingContentOpt.isPresent()) {
                    targetContent = existingContentOpt.get();
                    targetContent.setQuantity(targetContent.getQuantity() + request.quantity());
                    nestingTrolleyContentRepository.save(targetContent);
                } else {
                    // create new content
                    targetContent = NestingTrolleyContent.builder()
                            .quantity(request.quantity())
                            .nestingTrolley(targetTrolley)
                            .nestingLoadedDeliveries(sourceContent.getNestingLoadedDeliveries())
                            .build();
                    nestingTrolleyContentRepository.save(targetContent);
                }
                // dispose/reduce source(old) content
                if (request.quantity().equals(sourceContent.getQuantity())) {
                    nestingTrolleyContentRepository.deleteById(sourceContent.getId());
                    nestingTrolleyContentRepository.flush();
                } else {
                    sourceContent.setQuantity(sourceContent.getQuantity() - request.quantity());
                    nestingTrolleyContentRepository.save(sourceContent);
                }

                return List.of(sourceContent, targetContent);
            }
        }
        return List.of();
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
