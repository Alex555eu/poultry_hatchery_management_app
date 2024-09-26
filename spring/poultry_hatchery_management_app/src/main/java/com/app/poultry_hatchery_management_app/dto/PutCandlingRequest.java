package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutCandlingRequest(UUID candlingId, UUID nestingId, Integer candlingNumber) {
}
