package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingTrolleyContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface HatchingTrolleyContentRepository extends JpaRepository<HatchingTrolleyContent, UUID> {

    Optional<HatchingTrolleyContent> findByHatchingTrolleyId(UUID uuid);

    @Query(value = """
    select htc.* from hatching_trolley_content htc
    join hatching_loaded_deliveries hld on hld.id = htc.hatching_loaded_deliveries_id
    where hld.hatching_id = :hatchingId
""", nativeQuery = true)
    List<HatchingTrolleyContent> findByHatchingId(@Param("hatchingId") UUID hatchingId);

}
