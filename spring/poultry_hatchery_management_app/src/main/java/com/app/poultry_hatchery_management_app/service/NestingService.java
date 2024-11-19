package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostNestingRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingRequest;
import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.NestingRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class NestingService {

    private final NestingRepository nestingRepository;

    public List<Nesting> getAllNestings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return nestingRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return null;
    }

    public List<Nesting> getAllUnfinishedNestings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return nestingRepository.findAllByOrganisationIdAndFinished(user.getOrganisation().getId(), false);
        }
        return null;
    }

    public Optional<Nesting> getNesting(UUID nestingId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            Optional<Nesting> nesting = nestingRepository.findById(nestingId);
            if (nesting.isPresent() && nesting.get().getOrganisation().equals(user.getOrganisation())) {
                return nesting;
            }
        }
        return Optional.empty();
    }

    public Optional<Nesting> postNesting(PostNestingRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            Nesting nesting = Nesting.builder()
                    .organisation(user.getOrganisation())
                    .dateTime(LocalDateTime.now())
                    .title(request.title())
                    .isFinished(false)
                    .description(request.description())
                    .build();
            nestingRepository.save(nesting);

            return Optional.of(nesting);
        }
        return Optional.empty();
    }

    public Optional<Nesting> putNesting(PutNestingRequest request) {
        Optional<Nesting> nesting = nestingRepository.findById(request.id());
        if (nesting.isPresent()) {
            nesting.get().setTitle(request.title());
            nesting.get().setDescription(request.description());
            nesting.get().setFinished(request.isFinished());
            nestingRepository.save(nesting.get());

            return nesting;
        }
        return Optional.empty();
    }

    public void deleteNesting(UUID id) {
        nestingRepository.deleteById(id);
    }

}
