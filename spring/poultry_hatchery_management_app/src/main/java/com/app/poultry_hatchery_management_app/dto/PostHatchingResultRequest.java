package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostHatchingResultRequest(UUID hatchingLoadedDeliveryId, Integer quantity) {
}
