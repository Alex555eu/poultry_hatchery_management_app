package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.NestingIncubatorRepository;
import com.app.poultry_hatchery_management_app.repository.NestingIncubatorSpaceRepository;
import com.app.poultry_hatchery_management_app.repository.NestingTrolleyIncubatorSpaceAssignmentRepository;
import com.app.poultry_hatchery_management_app.repository.NestingTrolleyRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
@Slf4j
public class NestingIncubatorService {

    private final NestingIncubatorRepository nestingIncubatorRepository;
    private final NestingTrolleyRepository nestingTrolleyRepository;
    private final NestingIncubatorSpaceRepository nestingIncubatorSpaceRepository;
    private final NestingTrolleyIncubatorSpaceAssignmentRepository nestingTrolleyIncubatorSpaceAssignmentRepository;

    public List<NestingIncubator> getAllNestingIncubators(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            return nestingIncubatorRepository.findAllByOrganisationId(organisation.getId());
        }
        return null;
    }

    public Optional<NestingIncubator> getNestingIncubatorById(UUID id) {
        return nestingIncubatorRepository.findById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public Optional<NestingIncubator> postNestingIncubator(PostNestingIncubatorRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            NestingIncubator incubator = NestingIncubator.builder()
                    .maxCapacity(request.maxCapacity())
                    .numberOfColumns(request.numberOfColumns())
                    .humanReadableId(request.humanReadableId())
                    .organisation(organisation)
                    .build();
            nestingIncubatorRepository.save(incubator);

            for (int i = 0; i < request.maxCapacity(); i++) {
                PostNestingIncubatorSpaceRequest spaceRequest = PostNestingIncubatorSpaceRequest.builder()
                        .nestingIncubatorId(incubator.getId())
                        .humanReadableId("S"+(i+1))
                        .build();
                Optional<NestingIncubatorSpace> space = this.postNestingIncubatorSpace(spaceRequest);
                if (space.isEmpty()) {
                    throw new RuntimeException("Error while creating nesting incubator space");
                }
            }

            return Optional.of(incubator);
        }
        return Optional.empty();
    }

    public Optional<NestingIncubator> putNestingIncubator(PutNestingIncubatorRequest request){
        Optional<NestingIncubator> incubator = nestingIncubatorRepository.findById(request.incubatorId());

        if (incubator.isPresent()) {
            incubator.get().setMaxCapacity(request.maxCapacity());
            incubator.get().setHumanReadableId(request.humanReadableId());
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

    @Transactional
    public List<NestingIncubatorSpace> putNestingIncubatorSpaceSwap(PutNestingIncubatorSpaceSwapRequest request) {
        Optional<NestingIncubatorSpace> space1Opt = nestingIncubatorSpaceRepository.findById(request.nestingIncubatorSpaceId1());
        Optional<NestingIncubatorSpace> space2Opt = nestingIncubatorSpaceRepository.findById(request.nestingIncubatorSpaceId2());

        if (space1Opt.isPresent() && space2Opt.isPresent()) {
            NestingIncubatorSpace space1 = space1Opt.get();
            NestingIncubatorSpace space2 = space2Opt.get();

            String tmpHumanReadableId = space1.getHumanReadableId();
            space1.setHumanReadableId(space2.getHumanReadableId());
            space2.setHumanReadableId(tmpHumanReadableId);

            nestingIncubatorSpaceRepository.save(space1);
            nestingIncubatorSpaceRepository.save(space2);

            return List.of(space1, space2);
        }
        return List.of();
    }


    public void deleteNestingIncubatorSpace(UUID space) {
        nestingIncubatorSpaceRepository.deleteById(space);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////
    // NESTING INCUBATOR TRAFFIC
    ////////////////////////////////////////////////////////////////////////////////////////////


    public List<NestingTrolleyIncubatorSpaceAssignment> getNestingTrolleyCurrentlyInIncubator(UUID incubatorId) {
        return nestingTrolleyIncubatorSpaceAssignmentRepository.findAllByIncubatorId(incubatorId);
    }

    @Transactional
    public Optional<NestingTrolleyIncubatorSpaceAssignment> postNestingTrolleyToIncubatorSpace(PostNestingTrolleyToIncubatorRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(request.nestingTrolleyId());
        Optional<NestingIncubatorSpace> space = nestingIncubatorSpaceRepository.findById(request.nestingIncubatorSpaceId());

        if (trolley.isPresent() && space.isPresent()) {

            Optional<NestingTrolleyIncubatorSpaceAssignment> assignmentByTrolley =
                    nestingTrolleyIncubatorSpaceAssignmentRepository.findByNestingTrolleyId(trolley.get().getId());
            Optional<NestingTrolleyIncubatorSpaceAssignment> assignmentBySpace =
                    nestingTrolleyIncubatorSpaceAssignmentRepository.findByNestingIncubatorSpaceId(space.get().getId());

            if (assignmentByTrolley.isPresent() || assignmentBySpace.isPresent()) {
                if (assignmentByTrolley.isPresent() && assignmentBySpace.isPresent()) {
                    if (assignmentByTrolley.get().getId().equals(assignmentBySpace.get().getId())) {
                        return this.putNestingTrolleyToIncubatorSpace(new PutNestingTrolleyToIncubatorRequest(assignmentByTrolley.get().getId()));
                    }
                    this.putNestingIncubatorSpaceSwap(new PutNestingIncubatorSpaceSwapRequest(
                            assignmentByTrolley.get().getNestingIncubatorSpace().getId(),
                            assignmentBySpace.get().getNestingIncubatorSpace().getId())
                    );
                    return this.putNestingTrolleyToIncubatorSpace(new PutNestingTrolleyToIncubatorRequest(assignmentByTrolley.get().getId()));
                }
                if (assignmentByTrolley.isPresent()) {
                    this.deleteNestingTrolleyFromIncubatorSpace(assignmentByTrolley.get().getId());
                    nestingTrolleyIncubatorSpaceAssignmentRepository.flush();
                    nestingIncubatorSpaceRepository.flush();
                }
                if (assignmentBySpace.isPresent()) {
                    return Optional.empty();
                }
            }

            NestingTrolleyIncubatorSpaceAssignment ntisa = NestingTrolleyIncubatorSpaceAssignment.builder()
                    .nestingTrolley(trolley.get())
                    .nestingIncubatorSpace(space.get())
                    .trolleyExitStamp(null)
                    .trolleyEntryStamp(LocalDateTime.now())
                    .build();
            nestingTrolleyIncubatorSpaceAssignmentRepository.save(ntisa);

            space.get().setCurrentlyOccupied(true);
            nestingIncubatorSpaceRepository.save(space.get());

            return Optional.of(ntisa);
        }
        return Optional.empty();
    }


    public Optional<NestingTrolleyIncubatorSpaceAssignment> putNestingTrolleyToIncubatorSpace(PutNestingTrolleyToIncubatorRequest request) {
        Optional<NestingTrolleyIncubatorSpaceAssignment> ntisa =
                nestingTrolleyIncubatorSpaceAssignmentRepository.findById(request.assignmentId());
        if (ntisa.isPresent()) {
            if (ntisa.get().getNestingIncubatorSpace().isCurrentlyOccupied()) {
                ntisa.get().getNestingIncubatorSpace().setCurrentlyOccupied(false);
                ntisa.get().setTrolleyExitStamp(LocalDateTime.now());
            } else {
                ntisa.get().getNestingIncubatorSpace().setCurrentlyOccupied(true);
                ntisa.get().setTrolleyEntryStamp(LocalDateTime.now());
            }
            nestingTrolleyIncubatorSpaceAssignmentRepository.save(ntisa.get());

            return ntisa;
        }
        return Optional.empty();
    }

    @Transactional
    public void deleteNestingTrolleyFromIncubatorSpace(UUID assignmentId) {
        Optional<NestingTrolleyIncubatorSpaceAssignment> ntisa =
                nestingTrolleyIncubatorSpaceAssignmentRepository.findById(assignmentId);
        if (ntisa.isPresent()) {
            NestingIncubatorSpace space = ntisa.get().getNestingIncubatorSpace();
            space.setCurrentlyOccupied(false);
            nestingIncubatorSpaceRepository.save(space);
            nestingTrolleyIncubatorSpaceAssignmentRepository.delete(ntisa.get());
        }
    }

}
