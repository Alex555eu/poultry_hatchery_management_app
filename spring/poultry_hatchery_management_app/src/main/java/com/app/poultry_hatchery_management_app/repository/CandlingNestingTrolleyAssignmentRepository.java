package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.CandlingNestingTrolleyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CandlingNestingTrolleyAssignmentRepository extends JpaRepository<CandlingNestingTrolleyAssignment, UUID> {
}
