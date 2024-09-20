package com.app.poultry_hatchery_management_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NestingTrolleyIncubatorSpaceAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;


    @OneToOne
    private NestingIncubatorSpace nestingIncubatorSpace;

    @OneToOne
    private NestingTrolley nestingTrolley;

    private LocalDateTime trolleyExitStamp;

    private LocalDateTime trolleyEntryStamp;

}
