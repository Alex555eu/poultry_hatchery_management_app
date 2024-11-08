package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PatchTaskStatusRequest;
import com.app.poultry_hatchery_management_app.dto.PostTaskRequest;
import com.app.poultry_hatchery_management_app.dto.PutTaskRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.TaskNestingTrolleyAssignmentRepository;
import com.app.poultry_hatchery_management_app.repository.TaskRepository;
import com.app.poultry_hatchery_management_app.repository.TaskTypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskTypeRepository taskTypeRepository;
    private final TaskNestingTrolleyAssignmentRepository taskNestingTrolleyAssignmentRepository;

    private final NestingTrolleyService nestingTrolleyService;
    private final NestingService nestingService;

    public List<Task> getAllTasks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            return taskRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return List.of();
    }

    public List<Task> getAllTasksByNestingId(UUID nestingId) {
        return taskRepository.findAllByNestingId(nestingId);
    }

    public List<TaskNestingTrolleyAssignment> getAllTaskNestingTrolleysAssignmentsByTaskId(UUID taskId) {
        return taskNestingTrolleyAssignmentRepository.findAllByTaskId(taskId);
    }

    @Transactional
    public Optional<Task> postTask(PostTaskRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            Optional<TaskType> taskType = taskTypeRepository.findById(request.taskTypeId());
            Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());
            if (taskType.isPresent()) {
                Task task = Task.builder()
                        .taskType(taskType.get())
                        .taskStatus(TaskStatus.NOT_STARTED)
                        .executionScheduledAt(request.executionDateTime())
                        .executionCompletedAt(null)
                        .nesting(null)
                        .organisation(user.getOrganisation())
                        .build();

                if (nesting.isPresent()) {
                    task.setNesting(nesting.get());
                    taskRepository.save(task);

                    List<NestingTrolley> trolleys = nestingTrolleyService.getAllTrolleysByNestingId(nesting.get().getId());
                    for (NestingTrolley trolley : trolleys) {
                        TaskNestingTrolleyAssignment assignment = TaskNestingTrolleyAssignment.builder()
                                .task(task)
                                .isTaskCompleted(false)
                                .nestingTrolley(trolley)
                                .executor(null)
                                .build();
                        taskNestingTrolleyAssignmentRepository.save(assignment);
                    }
                    return Optional.of(task);
                }

                taskRepository.save(task);
                return Optional.of(task);
            }
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Task> putTask(PutTaskRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            Optional<TaskNestingTrolleyAssignment> assignment = taskNestingTrolleyAssignmentRepository.findById(request.taskNestingTrolleyAssignmentId());

            if (assignment.isPresent()) {
                Optional<Task> task = taskRepository.findByTaskNestingTrolleyAssignmentId(assignment.get().getId());
                if (task.isPresent()) {
                    Optional<Integer> countOfTrolleysWithUncompletedTask =
                            taskNestingTrolleyAssignmentRepository.countAllByTaskIdAndTaskCompletedIsFalse(task.get().getId());
                    if (request.isTaskCompleted()) {
                        assignment.get().setIsTaskCompleted(true);
                        assignment.get().setExecutor(user);
                        if (countOfTrolleysWithUncompletedTask.isPresent() && countOfTrolleysWithUncompletedTask.get() == 1) {
                            task.get().setTaskStatus(TaskStatus.COMPLETED);
                            task.get().setExecutionCompletedAt(LocalDateTime.now());
                        } else {
                            task.get().setTaskStatus(TaskStatus.IN_PROGRESS);
                        }
                    } else {
                        assignment.get().setIsTaskCompleted(false);
                        assignment.get().setExecutor(null);
                        if (countOfTrolleysWithUncompletedTask.isPresent() && countOfTrolleysWithUncompletedTask.get() == 0) {
                            task.get().setTaskStatus(TaskStatus.NOT_STARTED);
                            task.get().setExecutionCompletedAt(null);
                        } else {
                            task.get().setTaskStatus(TaskStatus.IN_PROGRESS);
                        }
                    }
                    taskRepository.save(task.get());
                    taskNestingTrolleyAssignmentRepository.save(assignment.get());

                    return task;
                }
            }
        }
        return Optional.empty();
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        taskNestingTrolleyAssignmentRepository.deleteAllByTaskId(taskId);
        taskRepository.deleteById(taskId);
    }

    public Optional<Task> patchTaskStatus(PatchTaskStatusRequest request) {
        Optional<Task> task = taskRepository.findById(request.taskId());
        try {
            if (task.isPresent()) {
                task.get().setTaskStatus(TaskStatus.valueOf(request.taskStatus())); // invalid TaskStatus will throw exception
                taskRepository.save(task.get());

                return task;
            }
        } catch (IllegalArgumentException ignored) {}

        return Optional.empty();
    }

}
