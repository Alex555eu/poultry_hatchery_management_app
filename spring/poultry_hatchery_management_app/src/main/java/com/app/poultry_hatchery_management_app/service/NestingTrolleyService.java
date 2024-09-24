package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.NestingTrolleyRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class NestingTrolleyService {

    private final NestingTrolleyRepository nestingTrolleyRepository;

    public List<NestingTrolley> getAllTrolleys() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            return nestingTrolleyRepository.findAllByOrganisationId(organisation.getId());
        }
        return null;
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


}
