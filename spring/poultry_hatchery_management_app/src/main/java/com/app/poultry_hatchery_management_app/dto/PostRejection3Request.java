package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostRejection3Request(UUID hatchingLoadedDeliveryId, Integer quantity, String cause) {
}
