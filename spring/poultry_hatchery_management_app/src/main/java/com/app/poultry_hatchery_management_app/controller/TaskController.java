package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PostTaskScheduleRequest;
import com.app.poultry_hatchery_management_app.dto.PutTaskScheduleRequest;
import com.app.poultry_hatchery_management_app.model.TaskSchedule;
import com.app.poultry_hatchery_management_app.service.TaskService;
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
@RequestMapping("api/v1/task")
public class TaskController {

    private final ObjectMapper objectMapper;
    private final TaskService taskService;

    @GetMapping("/")
    public ResponseEntity<String> getAllScheduledTasksByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<TaskSchedule> tasks = taskService.getAllScheduledTasksByNestingId(nestingId);
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    public ResponseEntity<String> postTaskSchedule(@RequestBody PostTaskScheduleRequest request) {
        Optional<TaskSchedule> tasks = taskService.postTaskSchedule(request);
        if (tasks.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/")
    public ResponseEntity<String> putTaskSchedule(@RequestBody PutTaskScheduleRequest request) {
        Optional<TaskSchedule> tasks = taskService.putTaskSchedule(request);
        if (tasks.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteTaskSchedule(@RequestParam UUID scheduledTaskId) {
        taskService.deleteTaskSchedule(scheduledTaskId);
        return ResponseEntity.ok().build();
    }

}
