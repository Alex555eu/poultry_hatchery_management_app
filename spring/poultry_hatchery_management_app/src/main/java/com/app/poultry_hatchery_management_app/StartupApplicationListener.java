package com.app.poultry_hatchery_management_app;

import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.Reject1Repository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class StartupApplicationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Reject1Repository reject1Repository;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        Reject1 reject1 = Reject1.builder()
                .nestingLoadedDeliveries(null)
                .quantity(10)
                .cause(RejectionCause.BRAK.verify(RejectionGroup.REJECT_1))
                .build();
        reject1Repository.save(reject1);

        //System.out.println(RejectionCause.getAvailableCauses(RejectionGroup.REJECT_1).toString());
    }
}
