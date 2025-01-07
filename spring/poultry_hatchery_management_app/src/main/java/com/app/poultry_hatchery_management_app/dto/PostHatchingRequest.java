package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostHatchingRequest(UUID nestingId, UUID taskId) {
}
