package com.app.poultry_hatchery_management_app.controller;


import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.service.RejectionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("api/v1/rejection")
public class RejectionController {

    private final ObjectMapper objectMapper;
    private final RejectionService rejectionService;

    @GetMapping("/one")
    public ResponseEntity<String> getAllRejections1ByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Rejection1> rejections = rejectionService.getAllRejections1ByNestingId(nestingId);
        if (rejections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(rejections);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/one")
    public ResponseEntity<String> postRejection1(@RequestBody PostRejection1Request request) {
        Optional<Rejection1> rejection = rejectionService.postRejection1(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/one")
    public ResponseEntity<String> putRejection1(@RequestBody PutRejectionRequest request) {
        Optional<Rejection1> rejection = rejectionService.putRejection1(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/one")
    public ResponseEntity<String> deleteRejection1ById(@RequestParam UUID rejectionId) {
        rejectionService.deleteRejection1ById(rejectionId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/two")
    public ResponseEntity<String> getAllRejections2ByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Rejection2> rejections = rejectionService.getAllRejections2ByNestingId(nestingId);
        if (rejections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(rejections);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/two")
    public ResponseEntity<String> postRejection2(@RequestBody PostRejection2Request request) {
        Optional<Rejection2> rejection = rejectionService.postRejection2(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/two")
    public ResponseEntity<String> putRejection2(@RequestBody PutRejectionRequest request) {
        Optional<Rejection2> rejection = rejectionService.putRejection2(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/two")
    public ResponseEntity<String> deleteRejection2ById(@RequestParam UUID rejectionId) {
        rejectionService.deleteRejection2ById(rejectionId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/three")
    public ResponseEntity<String> getAllRejections3ByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Rejection3> rejections = rejectionService.getAllRejections3ByNestingId(nestingId);
        if (rejections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(rejections);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/three")
    public ResponseEntity<String> postRejection3(@RequestBody PostRejection3Request request) {
        Optional<Rejection3> rejection = rejectionService.postRejection3(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/three")
    public ResponseEntity<String> putRejection3(@RequestBody PutRejectionRequest request) {
        Optional<Rejection3> rejection = rejectionService.putRejection3(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/three")
    public ResponseEntity<String> deleteRejection3ById(@RequestParam UUID rejectionId) {
        rejectionService.deleteRejection3ById(rejectionId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/four")
    public ResponseEntity<String> getAllRejections4ByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Rejection4> rejections = rejectionService.getAllRejections4ByNestingId(nestingId);
        if (rejections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(rejections);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/four")
    public ResponseEntity<String> postRejection4(@RequestBody PostRejection4Request request) {
        Optional<Rejection4> rejection = rejectionService.postRejection4(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/four")
    public ResponseEntity<String> putRejection4(@RequestBody PutRejectionRequest request) {
        Optional<Rejection4> rejection = rejectionService.putRejection4(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/four")
    public ResponseEntity<String> deleteRejection4ById(@RequestParam UUID rejectionId) {
        rejectionService.deleteRejection4ById(rejectionId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/unexpected")
    public ResponseEntity<String> getAllUnexpectedRejectionsByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<RejectionUnexpected> rejections = rejectionService.getAllUnexpectedRejectionsByNestingId(nestingId);
        if (rejections.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(rejections);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unexpected")
    public ResponseEntity<String> postUnexpectedRejection(@RequestBody PostUnexpectedRejectionRequest request) {
        Optional<RejectionUnexpected> rejection = rejectionService.postUnexpectedRejection(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/unexpected")
    public ResponseEntity<String> putUnexpectedRejection(@RequestBody PutRejectionRequest request) {
        Optional<RejectionUnexpected> rejection = rejectionService.putUnexpectedRejection(request);
        if (rejection.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/unexpected")
    public ResponseEntity<String> deleteUnexpectedRejectionById(@RequestParam UUID rejectionId) {
        rejectionService.deleteUnexpectedRejectionById(rejectionId);
        return ResponseEntity.ok().build();
    }


}
