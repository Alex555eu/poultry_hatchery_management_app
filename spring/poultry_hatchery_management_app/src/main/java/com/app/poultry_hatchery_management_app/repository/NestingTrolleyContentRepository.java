package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingTrolleyContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface NestingTrolleyContentRepository extends JpaRepository<NestingTrolleyContent, UUID> {

    @Query(value = """
    select ntc.* from nesting_trolley_content ntc
    join nesting_loaded_deliveries nld on nld.id = ntc.nesting_loaded_deliveries_id
    where nld.nesting_id = :id
""", nativeQuery = true)
    List<NestingTrolleyContent> findAllByNestingId(@Param("id") UUID id);

    List<NestingTrolleyContent> findAllByNestingTrolleyId(UUID id);

    Optional<NestingTrolleyContent> findByNestingTrolleyIdAndNestingLoadedDeliveriesId(UUID trolleyId, UUID deliveryId);
}
