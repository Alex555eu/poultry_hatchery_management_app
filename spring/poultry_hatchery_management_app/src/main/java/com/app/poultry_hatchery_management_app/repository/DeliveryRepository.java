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

    @Query(value = "SELECT d.* FROM delivery d " +
            "JOIN supplier s ON s.id = d.supplier_id " +
            "JOIN organisation o ON o.id = s.organisation_id " +
            "JOIN _user u ON u.organisation_id = o.id " +
            "WHERE u.id = :id", nativeQuery = true)
    List<Delivery> findByUserId(@Param("id") UUID id);

    List<Delivery> findBySupplierId(UUID id);


}
