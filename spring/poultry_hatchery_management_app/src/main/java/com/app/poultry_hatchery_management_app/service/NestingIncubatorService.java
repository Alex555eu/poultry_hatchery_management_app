package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingIncubatorRequest;
import com.app.poultry_hatchery_management_app.model.NestingIncubator;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.NestingIncubatorRepository;
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
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class NestingIncubatorService {

    private final ObjectMapper objectMapper;
    private final NestingIncubatorRepository nestingIncubatorRepository;

    public ResponseEntity<String> getAllNestingIncubators() throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            List<NestingIncubator> result = nestingIncubatorRepository.findAllByOrganisationId(organisation.getId());
            if (result.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            String response = objectMapper.writeValueAsString(result);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public ResponseEntity<String> postNestingIncubator(PostNestingIncubatorRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            NestingIncubator incubator = NestingIncubator.builder()
                    .maxCapacity(request.maxCapacity())
                    .organisation(organisation)
                    .build();
            nestingIncubatorRepository.save(incubator);

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public ResponseEntity<String> putNestingIncubator(PutNestingIncubatorRequest request){
        Optional<NestingIncubator> incubator = nestingIncubatorRepository.findById(request.incubatorId());

        if (incubator.isPresent()) {
            incubator.get().setMaxCapacity(request.maxCapacity());
            nestingIncubatorRepository.save(incubator.get());

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> deleteNestingIncubator(UUID incubatorId) {
        nestingIncubatorRepository.deleteById(incubatorId);
        return ResponseEntity.ok().build();
    }

}
