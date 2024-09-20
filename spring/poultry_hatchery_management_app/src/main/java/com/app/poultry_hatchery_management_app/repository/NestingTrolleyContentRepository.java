package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingTrolleyContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NestingTrolleyContentRepository extends JpaRepository<NestingTrolleyContent, UUID> {
}
