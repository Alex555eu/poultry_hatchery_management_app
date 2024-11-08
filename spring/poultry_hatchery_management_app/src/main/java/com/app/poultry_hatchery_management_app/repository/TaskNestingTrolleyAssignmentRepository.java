package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.TaskNestingTrolleyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskNestingTrolleyAssignmentRepository extends JpaRepository<TaskNestingTrolleyAssignment, UUID> {

    @Query(value = """
    select count(tnta.*) from task_nesting_trolley_assignment tnta
    join task t on t.id = tnta.tak_id
    where tnta.is_task_completed = false 
    and task.id = :taskId
""", nativeQuery = true)
    Optional<Integer> countAllByTaskIdAndTaskCompletedIsFalse(@Param("taskId") UUID taskId);

    List<TaskNestingTrolleyAssignment> findAllByTaskId(UUID taskId);

    void deleteAllByTaskId(UUID id);

}
