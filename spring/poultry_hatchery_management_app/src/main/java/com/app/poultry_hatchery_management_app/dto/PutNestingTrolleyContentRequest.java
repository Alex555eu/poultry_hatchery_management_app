package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingTrolleyContentRequest(UUID contentId, Integer quantity) {
}
