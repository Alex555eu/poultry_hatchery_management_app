package com.app.poultry_hatchery_management_app.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class TaskScheduleDetails {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    private Integer taskExecutionOrderNumber;

    private Integer daysOffsetFromPrevTask;

    @ManyToOne
    private TaskSchedule taskSchedule;

    @ManyToOne
    private TaskType taskType;


}
