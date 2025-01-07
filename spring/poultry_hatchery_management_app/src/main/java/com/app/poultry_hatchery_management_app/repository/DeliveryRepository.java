package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {

    @Query(value = """
        SELECT d.* FROM delivery d
        JOIN supplier s ON s.id = d.supplier_id
        WHERE s.organisation_id = :orgId
""", nativeQuery = true)
    List<Delivery> findByOrganisationId(@Param("orgId") UUID orgId);

    @Query(value = """
        SELECT d.*
        FROM delivery d
        join supplier s on s.id = d.supplier_id
        left JOIN nesting_loaded_deliveries nld ON nld.delivery_id = d.id
        where s.organisation_id = :orgId
        GROUP BY d.id
        HAVING SUM(COALESCE(nld.quantity, 0)) < d.quantity
""", nativeQuery = true)
    List<Delivery> findAllLeftOvers(@Param("orgId") UUID orgId);

    List<Delivery> findBySupplierId(UUID id);


}
