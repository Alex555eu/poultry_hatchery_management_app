package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.TaskSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskScheduleRepository extends JpaRepository<TaskSchedule, UUID> {

    @Query(value = """
    select ts.* from task_schedule ts 
    join nesting_trolley_content ntc on ntc.nesting_trolley_id = ts.nesting_trolley_id 
    join nesting_loaded_deliveries nld on nld.id = ntc.nesting_loaded_deliveries_id 
    where nld.nesting_id = :nestingId 
""", nativeQuery = true)
    List<TaskSchedule> findAllByNestingId(@Param("nestingId") UUID nestingId);

}
