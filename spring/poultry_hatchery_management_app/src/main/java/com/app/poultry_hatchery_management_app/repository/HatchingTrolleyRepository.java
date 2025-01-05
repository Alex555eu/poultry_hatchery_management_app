package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingTrolley;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface HatchingTrolleyRepository extends JpaRepository<HatchingTrolley, UUID> {

    @Query(value = """
    SELECT ht.*
    FROM hatching_trolley ht
    LEFT JOIN hatching_trolley_content htc ON htc.hatching_trolley_id = ht.id
    WHERE ht.organisation_id = :orgId
    AND htc.id IS NULL
""", nativeQuery = true)
    List<HatchingTrolley> findAllUnusedHatchingTrolleys(@Param("orgId") UUID orgId);

    List<HatchingTrolley> findAllByOrganisationId(UUID id);

}
