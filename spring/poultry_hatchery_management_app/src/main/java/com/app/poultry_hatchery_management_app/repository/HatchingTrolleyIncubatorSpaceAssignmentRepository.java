package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingTrolleyIncubatorSpaceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface HatchingTrolleyIncubatorSpaceAssignmentRepository extends JpaRepository<HatchingTrolleyIncubatorSpaceAssignment, UUID> {

    @Query(value = """
    select htisa.* from hatching_trolley_incubator_space_assignment
    join hatching_incubator_space his on his.id = htisa.hatching_incubator_space_id
    join hatching_incubator hi on hi.id = his.hatching_incubator_id
    where hi.id = :hatchingIncubatorId
""", nativeQuery = true)
    List<HatchingTrolleyIncubatorSpaceAssignment> findAllByHatchingIncubatorId(@Param("hatchingIncubatorId") UUID hatchingIncubatorId);

}
