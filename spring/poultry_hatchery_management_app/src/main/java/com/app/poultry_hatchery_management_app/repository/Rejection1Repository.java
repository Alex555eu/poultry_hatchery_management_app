package com.app.poultry_hatchery_management_app.repository;


import com.app.poultry_hatchery_management_app.model.Rejection1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface Rejection1Repository extends JpaRepository<Rejection1, UUID> {

    @Query(value = """
    select r1.* from rejection1 r1 
    join nesting_loaded_deliveries nld on nld.id = r1.nesting_loaded_deliveries_id 
    where nld.nesting_id = :nestingId 
""", nativeQuery = true)
    List<Rejection1> findAllByNestingId(@Param("nestingId") UUID nestingId);

}
