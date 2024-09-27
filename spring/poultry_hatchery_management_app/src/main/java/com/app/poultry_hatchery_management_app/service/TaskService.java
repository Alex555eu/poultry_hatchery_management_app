package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PostTaskScheduleRequest;
import com.app.poultry_hatchery_management_app.dto.PutTaskScheduleRequest;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import com.app.poultry_hatchery_management_app.model.Task;
import com.app.poultry_hatchery_management_app.model.TaskSchedule;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.TaskScheduleRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class TaskService {

    private final TaskScheduleRepository taskScheduleRepository;

    private final NestingTrolleyService nestingTrolleyService;

    public List<TaskSchedule> getAllScheduledTasksByNestingId(UUID nestingId) {
        return taskScheduleRepository.findAllByNestingId(nestingId);
    }

    public Optional<TaskSchedule> postTaskSchedule(PostTaskScheduleRequest request) {
        Optional<NestingTrolley> trolley = nestingTrolleyService.getTrolleyById(request.nestingTrolleyId());
        if (trolley.isPresent()) {
            TaskSchedule task = TaskSchedule.builder()
                    .task(Task.valueOf(request.task()))
                    .isTaskCompleted(false)
                    .executionDateTime(request.executionDateTime())
                    .executor(null)
                    .build();
            taskScheduleRepository.save(task);

            return Optional.of(task);
        }
        return Optional.empty();
    }

    public Optional<TaskSchedule> putTaskSchedule(PutTaskScheduleRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            User user = (User) authentication.getPrincipal();
            Optional<TaskSchedule> task = taskScheduleRepository.findById(request.taskScheduleId());
            if (task.isPresent()) {
                if (request.isTaskCompleted()) {
                    task.get().setTaskCompleted(true);
                    task.get().setExecutor(user);
                }
                task.get().setExecutionDateTime(request.executionDateTime());
                taskScheduleRepository.save(task.get());

                return task;
            }
        }
        return Optional.empty();
    }

    public void deleteTaskSchedule(UUID taskScheduleId) {
        taskScheduleRepository.deleteById(taskScheduleId);
    }

}
