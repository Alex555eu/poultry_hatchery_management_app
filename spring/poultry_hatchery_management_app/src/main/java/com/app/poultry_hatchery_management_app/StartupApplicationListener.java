package com.app.poultry_hatchery_management_app;

import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.Rejection1Repository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class StartupApplicationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Rejection1Repository rejection1Repository;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        Rejection1 rejection1 = Rejection1.builder()
                .nestingLoadedDeliveries(null)
                .quantity(10)
                .cause(RejectionCause.BRAK.verify(RejectionGroup.REJECTION_1))
                .build();
        rejection1Repository.save(rejection1);

        //System.out.println(RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_1).toString());
    }
}
