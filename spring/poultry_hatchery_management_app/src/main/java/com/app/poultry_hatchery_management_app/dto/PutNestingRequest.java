package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutNestingRequest(UUID id, String title, String description, boolean isFinished) {
}
