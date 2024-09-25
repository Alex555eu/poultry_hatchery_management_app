package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PostNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyContentRequest;
import com.app.poultry_hatchery_management_app.dto.PutNestingTrolleyRequest;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import com.app.poultry_hatchery_management_app.model.NestingTrolleyContent;
import com.app.poultry_hatchery_management_app.service.NestingTrolleyService;
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
@RestController
@RequestMapping("api/v1/nesting-trolley")
public class NestingTrolleyController {

    private final NestingTrolleyService nestingTrolleyService;
    private final ObjectMapper objectMapper;

    @GetMapping("/")
    public ResponseEntity<String> getAllTrolleys() throws JsonProcessingException {
        List<NestingTrolley> trolleyList = nestingTrolleyService.getAllTrolleys();
        if (trolleyList == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } else if (trolleyList.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(trolleyList);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/")
    public ResponseEntity<String> postTrolley(@RequestBody PostNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyService.postTrolley(request);
        if (trolley.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putTrolley(@RequestBody PutNestingTrolleyRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyService.putTrolley(request);
        if (trolley.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteTrolley(@RequestParam UUID trolleyId) {
        nestingTrolleyService.deleteTrolley(trolleyId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/content")
    public ResponseEntity<String> getNestingTrolleyContent(@RequestParam UUID trolleyId) throws JsonProcessingException {
       List<NestingTrolleyContent> trolleyContent = nestingTrolleyService.getNestingTrolleyContent(trolleyId);
        if (trolleyContent.isEmpty()) {
            return ResponseEntity.notFound().build();

        } else {
            String response = objectMapper.writeValueAsString(trolleyContent);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/content")
    public ResponseEntity<String> postTrolleyContent(@RequestBody PostNestingTrolleyContentRequest request){
        Optional<NestingTrolleyContent> trolleyContent = nestingTrolleyService.postTrolleyContent(request);
        if (trolleyContent.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/content")
    public ResponseEntity<String> putTrolleyContent(@RequestBody PutNestingTrolleyContentRequest request) {
        Optional<NestingTrolleyContent> trolleyContent = nestingTrolleyService.putTrolleyContent(request);
        if (trolleyContent.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/content")
    public ResponseEntity<String> deleteTrolleyContent(@RequestParam UUID trolleyContentId) {
        nestingTrolleyService.deleteTrolleyContent(trolleyContentId);
        return ResponseEntity.ok().build();
    }

}
