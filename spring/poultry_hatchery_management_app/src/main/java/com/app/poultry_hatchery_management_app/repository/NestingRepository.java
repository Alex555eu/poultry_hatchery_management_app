package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Nesting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NestingRepository extends JpaRepository<Nesting, UUID> {

    List<Nesting> findAllByOrganisationId(UUID id);

    @Query(value = """
    select n from Nesting n
    where n.organisation.id = :id
    and
    n.isFinished = :isFinished
""")
    List<Nesting> findAllByOrganisationIdAndFinished(@Param("id") UUID id, @Param("isFinished") boolean isFinished);

}
