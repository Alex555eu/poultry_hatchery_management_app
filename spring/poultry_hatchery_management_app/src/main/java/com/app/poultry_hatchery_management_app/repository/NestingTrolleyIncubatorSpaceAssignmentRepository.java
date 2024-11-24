package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.NestingTrolleyIncubatorSpaceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface NestingTrolleyIncubatorSpaceAssignmentRepository extends JpaRepository<NestingTrolleyIncubatorSpaceAssignment, UUID> {

    @Query(value = """
    select ntisa.* from nesting_trolley_incubator_space_assignment ntisa 
    join nesting_incubator_space nis on nis.id = ntisa.nesting_incubator_space_id 
    join nesting_incubator ni on ni.id = nis.nesting_incubator_id 
    where ni.id = :incubatorId
""", nativeQuery = true)
    List<NestingTrolleyIncubatorSpaceAssignment> findAllByIncubatorId(@Param("incubatorId") UUID incubatorId);

    Optional<NestingTrolleyIncubatorSpaceAssignment> findByNestingTrolleyId(UUID id);
    Optional<NestingTrolleyIncubatorSpaceAssignment> findByNestingIncubatorSpaceId(UUID id);

}
