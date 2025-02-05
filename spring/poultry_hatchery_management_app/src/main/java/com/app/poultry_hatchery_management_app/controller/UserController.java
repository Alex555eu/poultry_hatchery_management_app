package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RequestMapping("/api/v1/user")
@RestController
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @GetMapping(value = "")
    public ResponseEntity<String> getUserSelf() throws JsonProcessingException {
        User user = userService.getSelf();
        if (user != null) {
            String body = objectMapper.writeValueAsString(user);
            return ResponseEntity.ok().body(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @GetMapping(value = "/admin/others")
    public ResponseEntity<String> getAllOtherUsers() throws JsonProcessingException {
        List<User> userList = userService.getAllUsers();
        if (!userList.isEmpty()) {
            String body = objectMapper.writeValueAsString(userList);
            return ResponseEntity.ok().body(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/admin")
    public ResponseEntity<String> postUser(@RequestBody PostUserRequest request) {
        Optional<User> user = userService.postUser(request);
        if (user.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping(value = "/password")
    public ResponseEntity<String> postNewPassword(@RequestBody PostNewPasswordRequest request) throws JsonProcessingException {
        Optional<User> user = userService.postNewPassword(request);
        if (user.isPresent()) {
            String body = objectMapper.writeValueAsString(user.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping(value = "")
    public ResponseEntity<String> putUser(@RequestBody PutUserRequest request) throws JsonProcessingException {
        Optional<User> user = userService.putUser(request);
        if (user.isPresent()) {
            String body = objectMapper.writeValueAsString(user.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PatchMapping(value = "/admin")
    public ResponseEntity<String> patchUser(@RequestBody PatchEmployeeRequest request) throws JsonProcessingException {
        Optional<User> user = userService.patchUser(request);
        if (user.isPresent()) {
            String body = objectMapper.writeValueAsString(user.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping(value = "/admin/organisation")
    public ResponseEntity<String> putUser(@RequestBody PutOrganisationDetailsRequest request) throws JsonProcessingException {
        Optional<Organisation> org = userService.putOrganisation(request);
        if (org.isPresent()) {
            String body = objectMapper.writeValueAsString(org.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}
