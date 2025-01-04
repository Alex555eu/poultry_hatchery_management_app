package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Hatching;
import com.app.poultry_hatchery_management_app.model.Nesting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface HatchingRepository extends JpaRepository<Hatching, UUID> {

    Optional<Hatching> findByNestingId(UUID id);

    @Query(value = """
    select distinct h from Hatching h
    join Nesting n on h.nesting.id = n.id
    where n in :nestings
""")
    List<Hatching> findAllByNestings(@Param("nestings") List<Nesting> nestings);

}
