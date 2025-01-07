package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutHatchingIncubatorRequest(UUID hatchingIncubatorId, Integer maxCapacity, String humanReadableId, Integer numberOfColumns) {
}
