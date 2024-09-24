package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingIncubatorRequest(UUID incubatorId, Integer maxCapacity) {
}
