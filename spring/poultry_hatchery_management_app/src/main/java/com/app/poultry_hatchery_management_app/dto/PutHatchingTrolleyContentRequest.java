package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutHatchingTrolleyContentRequest(UUID hatchingTrolleyContentId, UUID hatchingLoadedDeliveriesId, Integer quantity) {
}
