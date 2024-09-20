package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Rejection1;
import com.app.poultry_hatchery_management_app.model.Rejection3;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface Rejection3Repository extends JpaRepository<Rejection3, UUID> {
}
