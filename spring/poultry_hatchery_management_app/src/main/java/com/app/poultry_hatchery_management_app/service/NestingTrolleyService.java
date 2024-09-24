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

    private final ObjectMapper objectMapper;
    private final NestingTrolleyRepository nestingTrolleyRepository;

    public ResponseEntity<String> getAllTrolleys() throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            List<NestingTrolley> result = nestingTrolleyRepository.findAllByOrganisationId(organisation.getId());
            String response = objectMapper.writeValueAsString(result);

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    public ResponseEntity<String> postTrolley(PostNestingTrolleyRequest request) {
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

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    public ResponseEntity<String> putTrolley(PutNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(request.trolleyId());

        if (trolley.isPresent()) {
            trolley.get().setAvailableCapacity(request.availableCapacity());
            trolley.get().setMaxCapacity(request.maxCapacity());
            trolley.get().setHumanReadableId(request.humanReadableId());

            nestingTrolleyRepository.save(trolley.get());

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<String> deleteTrolley(UUID trolleyId) {
        Optional<NestingTrolley> trolley = nestingTrolleyRepository.findById(trolleyId);
        if (trolley.isPresent()) {
            nestingTrolleyRepository.delete(trolley.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


}
