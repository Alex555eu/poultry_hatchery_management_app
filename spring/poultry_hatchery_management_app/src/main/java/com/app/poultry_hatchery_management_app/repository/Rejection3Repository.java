package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Rejection1;
import com.app.poultry_hatchery_management_app.model.Rejection3;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface Rejection3Repository extends JpaRepository<Rejection3, UUID> {

    @Query(value = """
    select r3.* from rejection3 r3 
    join hatching_loaded_deliveries hld on hld.id = r3.hatching_loaded_deliveries_id 
    join hatching h on h.id = hld.hatching_id 
    where h.nesting_id = :nestingId 
""", nativeQuery = true)
    List<Rejection3> findAllByNestingId(@Param("nestingId") UUID nestingId);

    @Query(value = """
    select r3.* from rejection3 r3 
    join hatching_loaded_deliveries hld on hld.id = r3.hatching_loaded_deliveries_id 
    where hld.hatching_id = :hatchingId
""", nativeQuery = true)
    List<Rejection3> findAllByHatchingId(@Param("hatchingId") UUID hatchingId);

}
