package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorSpaceRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.NestingIncubatorRepository;
import com.app.poultry_hatchery_management_app.repository.NestingIncubatorSpaceRepository;
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
public class NestingIncubatorService {

    private final NestingIncubatorRepository nestingIncubatorRepository;
    private final NestingIncubatorSpaceRepository nestingIncubatorSpaceRepository;

    public List<NestingIncubator> getAllNestingIncubators(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            return nestingIncubatorRepository.findAllByOrganisationId(organisation.getId());
        }
        return null;
    }

    public Optional<NestingIncubator> postNestingIncubator(PostNestingIncubatorRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            NestingIncubator incubator = NestingIncubator.builder()
                    .maxCapacity(request.maxCapacity())
                    .organisation(organisation)
                    .build();
            nestingIncubatorRepository.save(incubator);

            return Optional.of(incubator);
        }
        return Optional.empty();
    }

    public Optional<NestingIncubator> putNestingIncubator(PutNestingIncubatorRequest request){
        Optional<NestingIncubator> incubator = nestingIncubatorRepository.findById(request.incubatorId());

        if (incubator.isPresent()) {
            incubator.get().setMaxCapacity(request.maxCapacity());
            nestingIncubatorRepository.save(incubator.get());

            return incubator;
        }
        return Optional.empty();
    }

    public void deleteNestingIncubator(UUID incubatorId) {
        nestingIncubatorRepository.deleteById(incubatorId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    // NESTING INCUBATOR SPACE
    ////////////////////////////////////////////////////////////////////////////////////////////

    public List<NestingIncubatorSpace> getAllNestingIncubatorSpaces(UUID incubatorId) {
        return nestingIncubatorSpaceRepository.findAllByNestingIncubatorId(incubatorId);
    }

    public Optional<NestingIncubatorSpace> postNestingIncubatorSpace(PostNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubator> incubator = nestingIncubatorRepository.findById(request.nestingIncubatorId());
        if (incubator.isPresent()) {
            NestingIncubatorSpace space = NestingIncubatorSpace.builder()
                    .nestingIncubator(incubator.get())
                    .humanReadableId(request.humanReadableId())
                    .isCurrentlyOccupied(false)
                    .build();
            nestingIncubatorSpaceRepository.save(space);

            return Optional.of(space);
        }
        return Optional.empty();
    }

    public Optional<NestingIncubatorSpace> putNestingIncubatorSpace(PutNestingIncubatorSpaceRequest request) {
        Optional<NestingIncubatorSpace> space = nestingIncubatorSpaceRepository.findById(request.nestingIncubatorSpaceId());
        if (space.isPresent()) {
            space.get().setHumanReadableId(request.humanReadableId());
            space.get().setCurrentlyOccupied(request.isCurrentlyOccupied());
            nestingIncubatorSpaceRepository.save(space.get());

            return space;
        }
        return Optional.empty();
    }

    public void deleteNestingIncubatorSpace(UUID space) {
        nestingIncubatorSpaceRepository.deleteById(space);
    }

}
