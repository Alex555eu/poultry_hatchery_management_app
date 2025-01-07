package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostNestingTrolleyContentTransferRequest(UUID sourceNestingTrolleyContentId, UUID targetNestingTrolleyId, Integer quantity) {
}
