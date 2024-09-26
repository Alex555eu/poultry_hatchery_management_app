package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Hatching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface HatchingRepository extends JpaRepository<Hatching, UUID> {

    Optional<Hatching> findByNestingId(UUID id);

}
