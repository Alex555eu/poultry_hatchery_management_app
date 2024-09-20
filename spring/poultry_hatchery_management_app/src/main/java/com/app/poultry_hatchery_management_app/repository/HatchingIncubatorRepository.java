package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingIncubator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HatchingIncubatorRepository extends JpaRepository<HatchingIncubator, UUID> {
}
