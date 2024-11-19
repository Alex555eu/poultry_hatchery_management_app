package com.app.poultry_hatchery_management_app.model;

import java.util.List;
import java.util.Set;


public enum RejectionCause {

    BRAK,
    STLUCZKA,
    BRAK_ZARODKA,
    ZAMARLY_ZARODEK,
    NIEWYKLUTE,
    WYBRAKOWANE,
    INNE;

    public RejectionCause verify(RejectionGroup group) throws IllegalArgumentException {
        if(getAvailableCauses(group).contains(this))
            return this;
        else
            throw new IllegalArgumentException("RejectionCause does not belong to the provided RejectionGroup");
    }

    public static List<RejectionCause> getAvailableCauses(RejectionGroup group) {
        return switch (group) {
            case REJECTION_1 ->                                             // nesting -> loading deliveries
                    List.of(BRAK, STLUCZKA, INNE);
            case REJECTION_2 ->                                             // candling
                    List.of(BRAK_ZARODKA, ZAMARLY_ZARODEK, STLUCZKA, INNE);
            case REJECTION_3 ->                                             // hatching -> loading nesting
                    List.of(STLUCZKA, INNE);
            case REJECTION_4 ->                                             // hatching -> result
                    List.of(NIEWYKLUTE, WYBRAKOWANE, INNE);
            case REJECTION_UNEXPECTED ->
                    List.of(STLUCZKA, INNE);
        };
    }



}
