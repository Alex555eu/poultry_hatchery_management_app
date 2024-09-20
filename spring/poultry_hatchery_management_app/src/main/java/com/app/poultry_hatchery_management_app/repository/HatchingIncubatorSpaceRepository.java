package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingIncubatorSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface HatchingIncubatorSpaceRepository extends JpaRepository<HatchingIncubatorSpace, UUID> {
}
