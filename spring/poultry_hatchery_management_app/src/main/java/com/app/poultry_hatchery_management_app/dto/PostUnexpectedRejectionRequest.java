package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostUnexpectedRejectionRequest(UUID nestingId, Integer quantity, String cause) {
}
