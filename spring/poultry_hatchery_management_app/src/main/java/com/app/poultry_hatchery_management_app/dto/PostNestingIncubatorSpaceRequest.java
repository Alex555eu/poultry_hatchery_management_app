package com.app.poultry_hatchery_management_app.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record PostNestingIncubatorSpaceRequest(String humanReadableId, UUID nestingIncubatorId) {
}
