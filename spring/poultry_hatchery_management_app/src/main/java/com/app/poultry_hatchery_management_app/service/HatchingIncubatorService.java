package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostHatchingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PostHatchingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PutHatchingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.model.HatchingIncubator;
import com.app.poultry_hatchery_management_app.model.HatchingIncubatorSpace;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.HatchingIncubatorRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingIncubatorSpaceRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class HatchingIncubatorService {

    private final HatchingIncubatorRepository hatchingIncubatorRepository;
    private final HatchingIncubatorSpaceRepository hatchingIncubatorSpaceRepository;

    public List<HatchingIncubator> getAllHatchingIncubators() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            return hatchingIncubatorRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return null;
    }

    public Optional<HatchingIncubator> postHatchingIncubator(PostHatchingIncubatorRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            HatchingIncubator incubator = HatchingIncubator.builder()
                    .organisation(user.getOrganisation())
                    .maxCapacity(request.maxCapacity())
                    .build();
            hatchingIncubatorRepository.save(incubator);

            return Optional.of(incubator);
        }
        return Optional.empty();
    }

    public Optional<HatchingIncubator> putHatchingIncubator(PutHatchingIncubatorRequest request) {
        Optional<HatchingIncubator> incubator = hatchingIncubatorRepository.findById(request.hatchingIncubatorId());
        if (incubator.isPresent()) {
            incubator.get().setMaxCapacity(request.maxCapacity());
            hatchingIncubatorRepository.save(incubator.get());

            return incubator;
        }
        return Optional.empty();
    }

    public void deleteHatchingIncubator(UUID hatchingIncubatorId) {
        hatchingIncubatorRepository.deleteById(hatchingIncubatorId);
    }

    public List<HatchingIncubatorSpace> getAllHatchingIncubatorsSpace(UUID hatchingIncubatorSpaceId) {
        return hatchingIncubatorSpaceRepository.findAllByHatchingIncubatorId(hatchingIncubatorSpaceId);
    }

    public Optional<HatchingIncubatorSpace> postHatchingIncubatorSpace(PostHatchingIncubatorSpaceRequest request) {
        Optional<HatchingIncubator> incubator = hatchingIncubatorRepository.findById(request.hatchingIncubatorId());
        if (incubator.isPresent()) {
            HatchingIncubatorSpace space = HatchingIncubatorSpace.builder()
                    .hatchingIncubator(incubator.get())
                    .humanReadableId(request.humanReadableId())
                    .isCurrentlyOccupied(false)
                    .build();
            hatchingIncubatorSpaceRepository.save(space);
            return Optional.of(space);
        }
        return Optional.empty();
    }

    public Optional<HatchingIncubatorSpace> putHatchingIncubatorSpace(PutHatchingIncubatorSpaceRequest request) {
        Optional<HatchingIncubatorSpace> space = hatchingIncubatorSpaceRepository.findById(request.hatchingIncubatorSpaceId());
        if (space.isPresent()) {
            space.get().setCurrentlyOccupied(request.isCurrentlyOccupied());
            space.get().setHumanReadableId(request.humanReadableId());
            hatchingIncubatorSpaceRepository.save(space.get());

            return space;
        }
        return Optional.empty();
    }

    public void deleteHatchingIncubatorSpace(UUID hatchingIncubatorSpaceId) {
        hatchingIncubatorSpaceRepository.deleteById(hatchingIncubatorSpaceId);
    }


}
