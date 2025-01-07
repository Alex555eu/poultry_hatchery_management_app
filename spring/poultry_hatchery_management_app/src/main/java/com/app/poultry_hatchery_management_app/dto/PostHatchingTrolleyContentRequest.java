package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostHatchingTrolleyContentRequest(UUID hatchingTrolleyId, UUID hatchingLoadedDeliveriesId, Integer quantity) {
}
