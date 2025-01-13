package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.TaskSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskScheduleRepository extends JpaRepository<TaskSchedule, UUID> {

    List<TaskSchedule> findAllByOrganisationId(UUID id);


}
