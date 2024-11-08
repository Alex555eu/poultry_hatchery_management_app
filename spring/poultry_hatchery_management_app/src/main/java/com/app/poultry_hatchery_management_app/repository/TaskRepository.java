package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Task;
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

//    @Query(value = """
//    select ts.* from task_schedule ts
//    join nesting_trolley_content ntc on ntc.nesting_trolley_id = ts.nesting_trolley_id
//    join nesting_loaded_deliveries nld on nld.id = ntc.nesting_loaded_deliveries_id
//    where nld.nesting_id = :nestingId
//""", nativeQuery = true)
//    List<Task> findAllByNestingId(@Param("nestingId") UUID nestingId);

    List<Task> findAllByNestingId(UUID nestingId);

    @Query(value = """
    select t.* from task t
    join task_nesting_trolley_assignment tnta on tnta.taskId = t.id
    where tnta.id = :assignmentId
""", nativeQuery = true)
    Optional<Task> findByTaskNestingTrolleyAssignmentId(@Param("assignmentId") UUID assignmentId);

    List<Task> findAllByOrganisationId(UUID id);

}
