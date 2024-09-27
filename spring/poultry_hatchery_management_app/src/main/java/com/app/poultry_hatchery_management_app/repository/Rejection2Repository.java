package com.app.poultry_hatchery_management_app.repository;


import com.app.poultry_hatchery_management_app.model.Rejection1;
import com.app.poultry_hatchery_management_app.model.Rejection2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface Rejection2Repository extends JpaRepository<Rejection2, UUID> {

    @Query(value = """
    select r2.* from rejection2 r2 
    join candling_nesting_trolley_assignment cnta on cnta.id = r2.candling_nesting_trolley_assignment_id 
    join candling c on c.id = cnta.candling_id 
    where c.nesting_id = :nestingId 
""", nativeQuery = true)
    List<Rejection2> findAllByNestingId(@Param("nestingId") UUID nestingId);


}
