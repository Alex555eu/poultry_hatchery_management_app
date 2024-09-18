package com.app.poultry_hatchery_management_app.dto;

public record AuthenticationRequest(
        String email,
        String password
) {
}
