package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingTrolleyRequest(UUID trolleyId, String humanReadableId, Integer maxCapacity) {
}
