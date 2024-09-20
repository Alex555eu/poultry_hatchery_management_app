package com.app.poultry_hatchery_management_app.repository;

<<<<<<<< HEAD:spring/poultry_hatchery_management_app/src/main/java/com/app/poultry_hatchery_management_app/repository/Rejection1Repository.java
import com.app.poultry_hatchery_management_app.model.Rejection1;
========
import com.app.poultry_hatchery_management_app.model.Nesting;
>>>>>>>> orm/repositories:spring/poultry_hatchery_management_app/src/main/java/com/app/poultry_hatchery_management_app/repository/NestingRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

<<<<<<<< HEAD:spring/poultry_hatchery_management_app/src/main/java/com/app/poultry_hatchery_management_app/repository/Rejection1Repository.java
public interface Rejection1Repository extends JpaRepository<Rejection1, UUID> {
========
public interface NestingRepository extends JpaRepository<Nesting, UUID> {
>>>>>>>> orm/repositories:spring/poultry_hatchery_management_app/src/main/java/com/app/poultry_hatchery_management_app/repository/NestingRepository.java
}
