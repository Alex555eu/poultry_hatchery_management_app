package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductTypeRepository extends JpaRepository<ProductType, UUID> {

    Optional<ProductType> findByName(String name);

    List<ProductType> findAllByOrganisationId(UUID id);

}
