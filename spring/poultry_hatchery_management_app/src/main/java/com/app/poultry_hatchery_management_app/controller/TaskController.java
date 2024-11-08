package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.PatchTaskStatusRequest;
import com.app.poultry_hatchery_management_app.dto.PostTaskRequest;
import com.app.poultry_hatchery_management_app.dto.PutTaskRequest;
import com.app.poultry_hatchery_management_app.model.Task;
import com.app.poultry_hatchery_management_app.model.TaskNestingTrolleyAssignment;
import com.app.poultry_hatchery_management_app.service.TaskService;
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
@RequestMapping("api/v1/task")
public class TaskController {

    private final ObjectMapper objectMapper;
    private final TaskService taskService;

    @GetMapping("/all")
    public ResponseEntity<String> getAllTasks() throws JsonProcessingException {
        List<Task> tasks = taskService.getAllTasks();
        if (tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String body = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(body);
    }

    @GetMapping("")
    public ResponseEntity<String> getAllTasksByNestingId(@RequestParam UUID nestingId) throws JsonProcessingException {
        List<Task> tasks = taskService.getAllTasksByNestingId(nestingId);
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/trolley-assignments")
    public ResponseEntity<String> getAllTaskNestingTrolleyAssignmentsByTaskId(@RequestParam UUID taskId) throws JsonProcessingException {
        List<TaskNestingTrolleyAssignment> assignments = taskService.getAllTaskNestingTrolleysAssignmentsByTaskId(taskId);
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments);
        return ResponseEntity.ok(response);
    }

    @PostMapping("")
    public ResponseEntity<String> postTask(@RequestBody PostTaskRequest request) {
        Optional<Task> tasks = taskService.postTask(request);
        if (tasks.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("")
    public ResponseEntity<String> putTask(@RequestBody PutTaskRequest request) {
        Optional<Task> tasks = taskService.putTask(request);
        if (tasks.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("")
    public ResponseEntity<String> deleteTask(@RequestParam UUID scheduledTaskId) {
        taskService.deleteTask(scheduledTaskId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("")
    public ResponseEntity<String> patchTaskStatus(@RequestBody PatchTaskStatusRequest request) {
        Optional<Task> task = taskService.patchTaskStatus(request);
        if (task.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

}
