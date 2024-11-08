package com.app.poultry_hatchery_management_app.repository;


import com.app.poultry_hatchery_management_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailAddress(String email);

    List<User> findAllByOrganisationId(UUID id);

}
