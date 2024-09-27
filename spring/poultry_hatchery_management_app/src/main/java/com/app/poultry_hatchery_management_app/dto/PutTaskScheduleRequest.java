package com.app.poultry_hatchery_management_app.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PutTaskScheduleRequest(UUID taskScheduleId, LocalDateTime executionDateTime, boolean isTaskCompleted) {
}
