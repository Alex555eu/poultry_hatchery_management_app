package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Emergence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmergenceRepository extends JpaRepository<Emergence, UUID> {

    @Query(value = """
    select e.* from emergence e
    join hatching h on h.id = e.hatching_id
    join nesting n on n.id = h.nesting_id
    where n.organisation_id = :orgId
""", nativeQuery = true)
    List<Emergence> findAll(@Param("orgId") UUID orgId);


    @Query(value = """
    select e.* from emergence e
    join hatching h on h.id = e.hatching_id
    where h.nesting_id = :nestingId
    limit 1
""", nativeQuery = true)
    Optional<Emergence> findEmergenceByNestingId(@Param("nestingId") UUID nestingId);


    Optional<Emergence> findByTaskId(UUID taskId);

}
