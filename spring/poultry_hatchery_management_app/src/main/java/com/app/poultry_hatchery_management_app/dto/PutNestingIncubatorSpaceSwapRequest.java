package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingIncubatorSpaceSwapRequest(UUID nestingIncubatorSpaceId1, UUID nestingIncubatorSpaceId2) {
}
