package com.app.poultry_hatchery_management_app.controller;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
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

    @GetMapping("/admin/all")
    public ResponseEntity<String> getAllTasks() throws JsonProcessingException {
        List<Task> tasks = taskService.getAllTasks();
        if (tasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String body = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/all/active")
    public ResponseEntity<String> getAllActiveTasksByIncubatorId(@RequestParam UUID incubatorId) throws JsonProcessingException {
        List<Task> tasks = taskService.getAllActiveTasksByIncubatorId(incubatorId);
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all/active/trolley")
    public ResponseEntity<String> getAllActiveTasksByTrolleyId(@RequestParam UUID trolleyId) throws JsonProcessingException {
        List<Task> tasks = taskService.getAllActiveTasksByTrolleyId(trolleyId);
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all/active/task-type")
    public ResponseEntity<String> getAllActiveTasksByTaskTypeName(@RequestParam String taskTypeName) throws JsonProcessingException {
        List<Task> tasks = taskService.getAllActiveTasksByTaskTypeName(taskTypeName);
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(tasks);
        return ResponseEntity.ok(response);
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

    @PostMapping("/admin")
    public ResponseEntity<String> postTask(@RequestBody PostTaskRequest request) throws JsonProcessingException {
        Optional<Task> tasks = taskService.postTask(request);
        if (tasks.isPresent()) {
            String body = objectMapper.writeValueAsString(tasks.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/by-schedule")
    public ResponseEntity<String> postTaskBySchedule(@RequestBody PostTasksByScheduleRequest request){
        taskService.postTasksBySchedule(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/trolley-progress")
    public ResponseEntity<String> putTask(@RequestBody PutTaskRequest request) throws JsonProcessingException {
        Optional<Task> tasks = taskService.putTask(request);
        if (tasks.isPresent()) {
            String body = objectMapper.writeValueAsString(tasks.get());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin")
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

    ////////////////////////////////////////////////

    @GetMapping("/task-type")
    public ResponseEntity<String> getAllTaskTypes() throws JsonProcessingException {
        List<TaskType> assignments = taskService.getAllTaskTypes();
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments);
        return ResponseEntity.ok(response);
    }

    ///////////////////////////////////////////////

    @GetMapping("/admin/schedule")
    public ResponseEntity<String> getAllTaskSchedules() throws JsonProcessingException {
        List<TaskSchedule> assignments = taskService.getAllTaskSchedules();
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/schedule")
    public ResponseEntity<String> postTaskSchedule(@RequestBody PostTaskScheduleRequest request) throws JsonProcessingException {
        Optional<TaskSchedule> assignments = taskService.postTaskSchedule(request);
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments.get());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/schedule")
    public ResponseEntity<String> deleteTaskSchedule(@RequestParam UUID taskScheduleId){
        taskService.deleteTaskSchedule(taskScheduleId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/schedule-details")
    public ResponseEntity<String> getAllTaskScheduleDetails(@RequestParam UUID taskScheduleId) throws JsonProcessingException {
        List<TaskScheduleDetails> assignments = taskService.getAllTaskScheduleDetailsByScheduleId(taskScheduleId);
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/schedule-details")
    public ResponseEntity<String> postTaskScheduleDetail(@RequestBody PostTaskScheduleDetailsRequest request) throws JsonProcessingException {
        Optional<TaskScheduleDetails> assignments = taskService.postTaskScheduleDetails(request);
        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String response = objectMapper.writeValueAsString(assignments.get());
        return ResponseEntity.ok(response);
    }

}
