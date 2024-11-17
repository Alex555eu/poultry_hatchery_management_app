package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Task;
import com.app.poultry_hatchery_management_app.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findAllByNestingId(UUID nestingId);

    @Query(value = """
    select t.* from task t
    join task_nesting_trolley_assignment tnta on tnta.task_id = t.id
    where tnta.id = :assignmentId
""", nativeQuery = true)
    Optional<Task> findByTaskNestingTrolleyAssignmentId(@Param("assignmentId") UUID assignmentId);

    @Query(value = """
    select distinct t from Task t
    join TaskNestingTrolleyAssignment tnta on t = tnta.task
    join NestingTrolleyIncubatorSpaceAssignment ntisa on ntisa.nestingTrolley = tnta.nestingTrolley
    join NestingIncubator ni on ni = ntisa.nestingIncubatorSpace.nestingIncubator
    where t.taskStatus in :allowedStatuses
    and
    ni.id = :incubatorId
""")
    List<Task> findAllTasksByNestingIncubatorIdAndStatus(@Param("incubatorId") UUID incubatorId, @Param("allowedStatuses") List<TaskStatus> allowedStatuses);

    @Query(value = """
    select distinct t from Task t
    join TaskNestingTrolleyAssignment tnta on t = tnta.task
    where t.taskStatus in :allowedStatuses
    and
    tnta.nestingTrolley.id = :trolleyId
""")
    List<Task> findAllTasksByNestingTrolleyIdAndStatus(@Param("trolleyId") UUID trolleyId, @Param("allowedStatuses") List<TaskStatus> allowedStatuses);

    List<Task> findAllByOrganisationId(UUID id);
}
