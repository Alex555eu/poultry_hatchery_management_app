package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostHatchingIncubatorRequest(Integer maxCapacity, String humanReadableId, Integer numberOfColumns) {
}
