package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostTaskScheduleDetailsRequest(UUID taskScheduleId, UUID taskTypeId, Integer taskExecutionOrderNumber, Integer daysOffsetFromPrevTask) {
}
