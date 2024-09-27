package com.app.poultry_hatchery_management_app.model;

import java.util.List;
import java.util.Set;


public enum RejectionCause {

    BRAK,
    STLUCZKA;

    public RejectionCause verify(RejectionGroup group) throws IllegalArgumentException {
        if(getAvailableCauses(group).contains(this))
            return this;
        else
            throw new IllegalArgumentException("RejectionCause does not belong to the provided RejectionGroup");
    }

    public static List<RejectionCause> getAvailableCauses(RejectionGroup group) {
        return switch (group) {
            case REJECTION_1 ->
                    List.of(BRAK, STLUCZKA);
            case REJECTION_2 ->
                    List.of(BRAK);
            case REJECTION_3 ->
                    List.of(STLUCZKA);
            case REJECTION_4 ->
                    null;
            case REJECTION_UNEXPECTED ->
                    null;
        };
    }



}
