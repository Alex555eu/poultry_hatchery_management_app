package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@AllArgsConstructor
@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskTypeRepository taskTypeRepository;
    private final TaskNestingTrolleyAssignmentRepository taskNestingTrolleyAssignmentRepository;
    private final TaskScheduleRepository taskScheduleRepository;
    private final TaskScheduleDetailsRepository taskScheduleDetailsRepository;
    private final NestingRepository nestingRepository;

    private final NestingTrolleyRepository nestingTrolleyRepository;
    private final NestingTrolleyContentRepository nestingTrolleyContentRepository;

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

    public List<Task> getAllActiveTasksByIncubatorId(UUID incubatorId) {
        return taskRepository.findAllTasksByNestingIncubatorIdAndStatus(incubatorId, List.of(TaskStatus.IN_PROGRESS, TaskStatus.NOT_STARTED));
    }

    public List<Task> getAllActiveTasksByTrolleyId(UUID trolleyId) {
        return taskRepository.findAllTasksByNestingTrolleyIdAndStatus(trolleyId, List.of(TaskStatus.IN_PROGRESS, TaskStatus.NOT_STARTED));
    }

    public List<Task> getAllActiveTasksByTaskTypeName(String taskTypeName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            return taskRepository.findAllByTaskTypeName(taskTypeName, List.of(TaskStatus.IN_PROGRESS, TaskStatus.NOT_STARTED), user.getOrganisation().getId());
        }
        return List.of();
    }

    Optional<Task> getTaskById(UUID taskId) {
        return taskRepository.findById(taskId);
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
                        .comment(request.comment())
                        .executionCompletedAt(null)
                        .nesting(null)
                        .organisation(user.getOrganisation())
                        .build();

                if (nesting.isPresent()) {
                    task.setNesting(nesting.get());
                    taskRepository.save(task);

                    List<NestingTrolley> trolleys = nestingTrolleyRepository.findAllTrolleysByNestingId(nesting.get().getId());
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

            Optional<TaskNestingTrolleyAssignment> assignmentOptional =
                    taskNestingTrolleyAssignmentRepository.findByTaskIdAndNestingTrolleyId(request.taskId(), request.nestingTrolleyId());

            if (assignmentOptional.isPresent()) {
                TaskNestingTrolleyAssignment assignment = assignmentOptional.get();
                Task task = assignment.getTask();

                Optional<Integer> countOfTrolleysWithUncompletedTask =
                        taskNestingTrolleyAssignmentRepository.countAllByTaskIdAndTaskCompletedIsFalse(task.getId());
                if (request.isTaskCompleted()) {
                    assignment.setIsTaskCompleted(true);
                    assignment.setExecutor(user);
                    if (countOfTrolleysWithUncompletedTask.isPresent() && countOfTrolleysWithUncompletedTask.get() <= 1) {
                        task.setTaskStatus(TaskStatus.COMPLETED);
                        task.setExecutionCompletedAt(LocalDateTime.now());
                    } else {
                        task.setTaskStatus(TaskStatus.IN_PROGRESS);
                    }
                } else {
                    assignment.setIsTaskCompleted(false);
                    assignment.setExecutor(null);
                    if (countOfTrolleysWithUncompletedTask.isPresent() && countOfTrolleysWithUncompletedTask.get() <= 1) {
                        task.setTaskStatus(TaskStatus.NOT_STARTED);
                        task.setExecutionCompletedAt(null);
                    } else {
                        task.setTaskStatus(TaskStatus.IN_PROGRESS);
                    }
                }
                task.setComment(request.comment());
                taskRepository.save(task);
                taskNestingTrolleyAssignmentRepository.save(assignment);

                return Optional.of(task);

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


    public List<TaskType> getAllTaskTypes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            return taskTypeRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return List.of();
    }


    public List<TaskSchedule> getAllTaskSchedules() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            return taskScheduleRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return List.of();
    }

    public Optional<TaskSchedule> postTaskSchedule(PostTaskScheduleRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            TaskSchedule taskSchedule = TaskSchedule.builder()
                    .title(request.title())
                    .organisation(user.getOrganisation())
                    .build();
            taskScheduleRepository.save(taskSchedule);

            return Optional.of(taskSchedule);
        }
        return Optional.empty();
    }

    @Transactional
    public void postTasksBySchedule(PostTasksByScheduleRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();

            Optional<Nesting> nestingOpt = nestingRepository.findById(request.nestingId());
            Optional<TaskSchedule> taskScheduleOpt = taskScheduleRepository.findById(request.taskScheduleId());

            if (nestingOpt.isPresent() && taskScheduleOpt.isPresent()) {
                Nesting nesting = nestingOpt.get();
                TaskSchedule taskSchedule = taskScheduleOpt.get();
                List<TaskScheduleDetails> details = taskScheduleDetailsRepository.findAllByTaskScheduleId(taskSchedule.getId()).stream()
                        .sorted(Comparator.comparingInt(TaskScheduleDetails::getTaskExecutionOrderNumber))
                        .toList();

                LocalDateTime current = request.beginFrom();
                for (TaskScheduleDetails detail : details) {
                    current = current.plusDays(detail.getDaysOffsetFromPrevTask());
                    this.postTask(new PostTaskRequest(nesting.getId(), detail.getTaskType().getId(), current, ""));
                }
            }
        }
    }

    @Transactional
    public void deleteTaskSchedule(UUID taskScheduleId) {
        taskScheduleDetailsRepository.deleteAllByTaskScheduleId(taskScheduleId);
        taskScheduleRepository.deleteById(taskScheduleId);
    }

    public Optional<TaskScheduleDetails> postTaskScheduleDetails(PostTaskScheduleDetailsRequest request) {
        Optional<TaskSchedule> schedule = taskScheduleRepository.findById(request.taskScheduleId());
        Optional<TaskType> taskType = taskTypeRepository.findById(request.taskTypeId());

        if (schedule.isPresent() && taskType.isPresent()) {

            TaskScheduleDetails taskScheduleDetails = TaskScheduleDetails.builder()
                    .taskExecutionOrderNumber(request.taskExecutionOrderNumber())
                    .daysOffsetFromPrevTask(request.daysOffsetFromPrevTask())
                    .taskSchedule(schedule.get())
                    .taskType(taskType.get())
                    .build();
            taskScheduleDetailsRepository.save(taskScheduleDetails);

            return Optional.of(taskScheduleDetails);
        }
        return Optional.empty();
    }

    public List<TaskScheduleDetails> getAllTaskScheduleDetailsByScheduleId(UUID taskScheduleId) {
        return taskScheduleDetailsRepository.findAllByTaskScheduleId(taskScheduleId);
    }


    public void updateTaskNestingTrolleyAssignmentAfterContentChange(UUID nestingTrolleyId) {
        Optional<NestingTrolley> trolleyOpt = nestingTrolleyRepository.findById(nestingTrolleyId);

        if (trolleyOpt.isPresent()) {
            NestingTrolley trolley = trolleyOpt.get();
            List<NestingTrolleyContent> contentList = nestingTrolleyContentRepository.findAllByNestingTrolleyId(nestingTrolleyId);

            if (contentList.isEmpty()) {
                List<Task> list = taskRepository.findAllTasksByNestingTrolleyIdAndStatus(nestingTrolleyId, List.of(TaskStatus.IN_PROGRESS, TaskStatus.NOT_STARTED));
                for(Task task : list) {
                    taskNestingTrolleyAssignmentRepository.deleteByTaskIdAndNestingTrolleyId(task.getId(), nestingTrolleyId);
                }
            } else {
                List<Task> list = taskRepository.findAllByNestingId(contentList.getFirst().getNestingLoadedDeliveries().getNesting().getId()).stream()
                        .filter(item -> item.getTaskStatus().equals(TaskStatus.IN_PROGRESS) || item.getTaskStatus().equals(TaskStatus.NOT_STARTED))
                        .toList();
                for(Task task : list) {
                    Optional<TaskNestingTrolleyAssignment> assignment =
                            taskNestingTrolleyAssignmentRepository.findByTaskIdAndNestingTrolleyId(task.getId(), trolley.getId());
                    if (assignment.isEmpty()) {
                        TaskNestingTrolleyAssignment tnta = TaskNestingTrolleyAssignment.builder()
                                .nestingTrolley(trolley)
                                .isTaskCompleted(false)
                                .task(task)
                                .executor(null)
                                .build();
                        taskNestingTrolleyAssignmentRepository.save(tnta);
                    }
                }
            }
        }
    }

}
