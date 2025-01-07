package com.app.poultry_hatchery_management_app.dto;

public record PostNestingIncubatorRequest(Integer maxCapacity, String humanReadableId, Integer numberOfColumns) { // possible expansion
}
