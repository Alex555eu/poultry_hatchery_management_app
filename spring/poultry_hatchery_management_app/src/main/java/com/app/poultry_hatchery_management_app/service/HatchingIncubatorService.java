package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.HatchingIncubatorRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingIncubatorSpaceRepository;
import com.app.poultry_hatchery_management_app.repository.HatchingTrolleyIncubatorSpaceAssignmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class HatchingIncubatorService {

    private final HatchingIncubatorRepository hatchingIncubatorRepository;
    private final HatchingIncubatorSpaceRepository hatchingIncubatorSpaceRepository;
    private final HatchingTrolleyIncubatorSpaceAssignmentRepository hatchingTrolleyIncubatorSpaceAssignmentRepository;

    private final HatchingTrolleyService hatchingTrolleyService;

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

    public List<HatchingTrolleyIncubatorSpaceAssignment> getAllTrolleysFromHatchingIncubator(UUID hatchingIncubatorId) {
        Optional<HatchingIncubator> incubator = hatchingIncubatorRepository.findById(hatchingIncubatorId);
        if (incubator.isPresent()) {
            return hatchingTrolleyIncubatorSpaceAssignmentRepository.findAllByHatchingIncubatorId(hatchingIncubatorId);
        }
        return List.of();
    }

    public Optional<HatchingTrolleyIncubatorSpaceAssignment> postHatchingTrolleyToIncubatorSpace(PostHatchingTrolleyIncubatorSpaceAssignmentRequest request) {
        Optional<HatchingTrolley> trolley = hatchingTrolleyService.getHatchingTrolleyById(request.hatchingTrolleyId());
        Optional<HatchingIncubatorSpace> space = hatchingIncubatorSpaceRepository.findById(request.hatchingIncubatorSpaceId());

        if (trolley.isPresent() && space.isPresent()) {
            HatchingTrolleyIncubatorSpaceAssignment htisa = HatchingTrolleyIncubatorSpaceAssignment.builder()
                    .hatchingTrolley(trolley.get())
                    .hatchingIncubatorSpace(space.get())
                    .trolleyExitStamp(null)
                    .trolleyEntryStamp(LocalDateTime.now())
                    .build();
            hatchingTrolleyIncubatorSpaceAssignmentRepository.save(htisa);

            return Optional.of(htisa);
        }
        return Optional.empty();
    }

    public Optional<HatchingTrolleyIncubatorSpaceAssignment> putHatchingTrolleyToIncubatorSpace(PutHatchingTrolleyIncubatorSpaceAssignmentRequest request) {
        Optional<HatchingTrolleyIncubatorSpaceAssignment> assignment =
                hatchingTrolleyIncubatorSpaceAssignmentRepository.findById(request.assignmentId());
        if (assignment.isPresent()) {
            if (assignment.get().getHatchingIncubatorSpace().isCurrentlyOccupied()) {
                assignment.get().getHatchingIncubatorSpace().setCurrentlyOccupied(false);
                assignment.get().setTrolleyExitStamp(LocalDateTime.now());
            } else {
                assignment.get().getHatchingIncubatorSpace().setCurrentlyOccupied(true);
                assignment.get().setTrolleyEntryStamp(LocalDateTime.now());
            }
            return assignment;
        }
        return Optional.empty();
    }

    public void deleteHatchingTrolleyFromIncubatorSpace(UUID assignmentId) {
        hatchingTrolleyIncubatorSpaceAssignmentRepository.deleteById(assignmentId);
    }
}
