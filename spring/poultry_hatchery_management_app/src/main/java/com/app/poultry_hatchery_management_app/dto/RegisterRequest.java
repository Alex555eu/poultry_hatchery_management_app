package com.app.poultry_hatchery_management_app.dto;


public record RegisterRequest(
        String password,
        String firstName,
        String lastName,
        String emailAddress,
        String orgName,
        String orgCity,
        String orgPostalCode,
        String orgAddress,
        String orgRegon
) {
}
