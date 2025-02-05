package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.TaskScheduleDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskScheduleDetailsRepository extends JpaRepository<TaskScheduleDetails, UUID> {

    List<TaskScheduleDetails> findAllByTaskScheduleId(UUID uuid);

    void deleteAllByTaskScheduleId(UUID uuid);

}
