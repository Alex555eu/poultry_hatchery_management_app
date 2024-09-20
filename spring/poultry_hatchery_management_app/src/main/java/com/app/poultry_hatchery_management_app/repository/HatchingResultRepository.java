package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.HatchingResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface HatchingResultRepository extends JpaRepository<HatchingResult, UUID> {
}
