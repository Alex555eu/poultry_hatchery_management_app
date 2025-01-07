package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface HatchingResultRepository extends JpaRepository<HatchingResult, UUID> {

    @Query(value = """
    select hr.* from hatching_result hr
    join hatching_loaded_deliveries hld on hld.id = hr.hatching_loaded_deliveries_id
    join hatching h on h.id = hld.hatching_id
    where h.id = :hatchingId
""", nativeQuery = true)
    List<HatchingResult> findAllByHatchingId(@Param("hatchingId") UUID hatchingId);


}
