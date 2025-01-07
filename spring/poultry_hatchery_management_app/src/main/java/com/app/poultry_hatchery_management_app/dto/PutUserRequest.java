package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutUserRequest(UUID userId, String firstName, String lastName, String phoneNumber) {
}
