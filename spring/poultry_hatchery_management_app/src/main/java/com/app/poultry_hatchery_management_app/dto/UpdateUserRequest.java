package com.app.poultry_hatchery_management_app.dto;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        String emailAddress
) {
}
