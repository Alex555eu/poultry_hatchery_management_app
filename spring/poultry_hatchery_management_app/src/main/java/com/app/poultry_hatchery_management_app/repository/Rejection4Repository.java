package com.app.poultry_hatchery_management_app.repository;


import com.app.poultry_hatchery_management_app.model.Rejection4;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface Rejection4Repository extends JpaRepository<Rejection4, UUID> {

    @Query(value = """
    select r4.* from rejection4 r4 
    join hatching_result hr on hr.id = r4.hatching_result_id 
    join hatching_loaded_deliveries hld on hld.id = hr.hatching_loaded_deliveries_id 
    join hatching h on h.id = hld.hatching_id 
    where h.nesting_id = :nestingId 
""", nativeQuery = true)
    List<Rejection4> findAllByNestingId(@Param("nestingId") UUID nestingId);

}
