package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.NestingIncubator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface NestingIncubatorRepository extends JpaRepository<NestingIncubator, UUID> {

    List<NestingIncubator> findAllByOrganisationId(UUID id);

//    @Query(value = """
//    select ni.* from nesting_incubator ni
//    join nesting_incubator_space nis on nis.nesting_incubator_id = ni.id
//    join nesting_trolley_incubator_space_assignment ntisa on ntisa.nesting_incubator_space_id = nis.id
//    join nesting_trolley nt on nt.id = ntisa.nesting_trolley_id
//    join task_nesting_trolley_assignment tnta on tnta.nesting_trolley_id = nt.id
//    where tnta.id = :assignmentId
//""", nativeQuery = true)
//    Optional<NestingIncubator> findByTaskNestingTrolleyAssignment(@Param("assignmentId") UUID assignmentId);

}
