package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Candling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface CandlingRepository extends JpaRepository<Candling, UUID> {

    Optional<Candling> findByTaskId(UUID taskId);
    List<Candling> findAllByOrganisationId(UUID id);
    List<Candling> findAllByNestingId(UUID id);

}
