package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostUserRequest;
import com.app.poultry_hatchery_management_app.dto.PutUserRequest;
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
@RequestMapping("/api/v1/admin/user/")
@RestController
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;

    @GetMapping(value = "/")
    public ResponseEntity<String> getAdmin() throws JsonProcessingException {
        User user = userService.getSelf();
        if (user != null) {
            String body = objectMapper.writeValueAsString(user);
            return ResponseEntity.ok().body(body);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    @GetMapping(value = "/all")
    public ResponseEntity<String> getAllUsers() throws JsonProcessingException {
        List<User> userList = userService.getAllUsers();
        if (!userList.isEmpty()) {
            String body = objectMapper.writeValueAsString(userList);
            return ResponseEntity.ok().body(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> postUser(@RequestBody PostUserRequest request) {
        Optional<User> user = userService.postUser(request);
        if (user.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping(value = "/")
    public ResponseEntity<String> putUser(@RequestBody PutUserRequest request) {
        Optional<User> user = userService.putUser(request);
        if (user.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping(value = "/")
    public ResponseEntity<String> deleteUser(@RequestParam UUID userId) {
        Optional<User> user = userService.deleteUser(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}
