package com.app.poultry_hatchery_management_app.dto;

import java.util.UUID;

public record PutOrganisationDetailsRequest(String name, String city, String postalCode, String street, String number) {
}
