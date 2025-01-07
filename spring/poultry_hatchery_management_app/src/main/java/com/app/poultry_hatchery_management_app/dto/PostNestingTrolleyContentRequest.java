package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostNestingTrolleyContentRequest(UUID nestingTrolleyId, UUID nestingLoadedDeliveriesId, Integer quantity) {
}
