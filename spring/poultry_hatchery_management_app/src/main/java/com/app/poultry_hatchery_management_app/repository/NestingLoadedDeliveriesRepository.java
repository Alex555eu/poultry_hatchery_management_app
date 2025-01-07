package com.app.poultry_hatchery_management_app.repository;

import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingLoadedDeliveries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface NestingLoadedDeliveriesRepository extends JpaRepository<NestingLoadedDeliveries, UUID> {

    @Query(value = """
    select nld from NestingLoadedDeliveries nld
    join Nesting n on n.id = nld.nesting.id
    join Organisation org on org.id = n.organisation.id
    where org.id = :orgId
""")
    List<NestingLoadedDeliveries> findAllByOrganisationId(@Param("orgId") UUID orgId);

    List<NestingLoadedDeliveries> findAllByNestingId(UUID id);

}
