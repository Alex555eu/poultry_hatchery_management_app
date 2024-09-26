package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingTrolley;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface HatchingTrolleyRepository extends JpaRepository<HatchingTrolley, UUID> {

    List<HatchingTrolley> findAllByOrganisationId(UUID id);

}
