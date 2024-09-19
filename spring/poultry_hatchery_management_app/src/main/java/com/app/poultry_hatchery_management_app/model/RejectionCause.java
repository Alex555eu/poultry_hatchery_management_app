package com.app.poultry_hatchery_management_app.model;

import java.util.List;
import java.util.Set;


public enum RejectionCause {

    BRAK,
    STLUCZKA;

    public RejectionCause verify(RejectionGroup group) {
        if(getAvailableCauses(group).contains(this))
            return this;
        else
            throw new IllegalArgumentException("Provided RejectionCause does not belong to the provided RejectionGroup");
    }

    public static List<RejectionCause> getAvailableCauses(RejectionGroup group) {
        return switch (group) {
            case REJECT_1 ->
                    List.of(BRAK, STLUCZKA);
            case REJECT_2 ->
                    List.of(BRAK);
            case REJECT_3 ->
                    List.of(STLUCZKA);
            case REJECT_4 ->
                    null;
            case REJECT_UNEXPECTED ->
                    null;
        };
    }



}
