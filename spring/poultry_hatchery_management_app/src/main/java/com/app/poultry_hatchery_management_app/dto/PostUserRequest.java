package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PostUserRequest(String firstName, String lastName, String password, String emailAddress, String phoneNumber) {
}
