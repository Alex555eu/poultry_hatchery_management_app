package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingTrolleyIncubatorSpaceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HatchingTrolleyIncubatorSpaceAssignmentRepository extends JpaRepository<HatchingTrolleyIncubatorSpaceAssignment, UUID> {
}
