package com.app.poultry_hatchery_management_app.repository;


import com.app.poultry_hatchery_management_app.model.Rejection4;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface Rejection4Repository extends JpaRepository<Rejection4, UUID> {
}
