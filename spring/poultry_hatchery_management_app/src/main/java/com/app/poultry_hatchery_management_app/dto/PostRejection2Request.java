package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostRejection2Request(UUID candlingNestingTrolleyAssignmentId, UUID nestingLoadedDeliveryId, Integer quantity, String cause) {
}
