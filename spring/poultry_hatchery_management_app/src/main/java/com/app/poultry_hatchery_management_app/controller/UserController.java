package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PutAdminRequest;
import com.app.poultry_hatchery_management_app.dto.PutUserRequest;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@AllArgsConstructor
@RequestMapping("/api/v1/admin/data/user")
@RestController
public class UserController {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @PutMapping(value = "/")
    public ResponseEntity<String> updateUser(@RequestBody PutUserRequest request) {
        Optional<User> user = userRepository.findById(request.userId());

        if (user.isPresent()) {
            user.get().setFirstName(request.firstName());
            user.get().setLastName(request.lastName());
            userRepository.save(user.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping(value = "/self")
    public ResponseEntity<String> updateAdmin(@RequestBody PutAdminRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            user.setFirstName(request.firstName());
            user.setLastName(request.lastName());
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/self")
    public ResponseEntity<String> getAdmin() throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            String body = objectMapper.writeValueAsString(user);
            return ResponseEntity.ok().body(body);
        }
        return ResponseEntity.notFound().build();
    }

}
