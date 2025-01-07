package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostRejection4Request(UUID hatchingResultId, Integer quantity, String cause) {
}
