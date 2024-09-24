package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingIncubatorSpaceRequest(UUID nestingIncubatorSpaceId, String humanReadableId, boolean isCurrentlyOccupied) {
}
