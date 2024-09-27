package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutRejectionRequest(UUID rejectionId, Integer quantity, String cause) {
}
