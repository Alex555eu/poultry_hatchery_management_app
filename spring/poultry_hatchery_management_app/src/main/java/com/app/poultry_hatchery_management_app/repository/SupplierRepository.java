package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    List<Supplier> findAllByOrganisationId(UUID id);

}
