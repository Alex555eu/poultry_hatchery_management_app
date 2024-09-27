package com.app.poultry_hatchery_management_app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HatchingTrolleyIncubatorSpaceAssignment {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    private LocalDateTime trolleyExitStamp;

    private LocalDateTime trolleyEntryStamp;

    @OneToOne
    private HatchingIncubatorSpace hatchingIncubatorSpace;

    @OneToOne
    private HatchingTrolley hatchingTrolley;

}
