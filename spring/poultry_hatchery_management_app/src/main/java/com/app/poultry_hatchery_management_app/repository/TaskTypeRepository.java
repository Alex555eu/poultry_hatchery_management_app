package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskTypeRepository extends JpaRepository<TaskType, UUID> {

    List<TaskType> findAllByOrganisationId(UUID id);
}
