package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.CandlingNestingTrolleyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandlingNestingTrolleyAssignmentRepository extends JpaRepository<CandlingNestingTrolleyAssignment, UUID> {

    List<CandlingNestingTrolleyAssignment> findAllByCandlingId(UUID id);

    Optional<CandlingNestingTrolleyAssignment> findByNestingTrolleyId(UUID id);

}
