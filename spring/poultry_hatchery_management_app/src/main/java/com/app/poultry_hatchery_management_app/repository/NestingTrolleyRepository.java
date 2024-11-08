package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface NestingTrolleyRepository extends JpaRepository<NestingTrolley, UUID> {

    List<NestingTrolley> findAllByOrganisationId(UUID id);

    @Query(value = """
    select distinct nt.* from nesting_trolley nt
    join nesting_trolley_content ntc on ntc.nesting_trolley_id = nt.id 
    join nesting_loaded_deliveries nld on nld.id = ntc.nesting_loaded_deliveries_id 
    where nld.nesting_id = :nestingId 
""", nativeQuery = true)
    List<NestingTrolley> findAllTrolleysByNestingId(@Param("nestingId") UUID nestingId);

}
