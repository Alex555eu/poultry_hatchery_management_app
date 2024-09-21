package com.app.poultry_hatchery_management_app;

import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.DeliveryRepository;
import com.app.poultry_hatchery_management_app.repository.OrganisationRepository;
import com.app.poultry_hatchery_management_app.repository.Rejection1Repository;
import com.app.poultry_hatchery_management_app.repository.SupplierRepository;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@AllArgsConstructor
@Component
public class StartupApplicationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Rejection1Repository rejection1Repository;
    private final OrganisationRepository organisationRepository;
    private final SupplierRepository supplierRepository;
    private final DeliveryRepository deliveryRepository;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        Rejection1 rejection1 = Rejection1.builder()
                .nestingLoadedDeliveries(null)
                .quantity(10)
                .cause(RejectionCause.BRAK.verify(RejectionGroup.REJECTION_1))
                .build();
        rejection1Repository.save(rejection1);

        //System.out.println(RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_1).toString());
        Organisation organisation = Organisation.builder()
                .address("string")
                .regon("string")
                .city("string")
                .name("string")
                .postalCode("string")
                .build();
        organisationRepository.save(organisation);

        Supplier supplier = Supplier.builder()
                .WNI("string")
                .surname("string")
                .name("string")
                .address("string")
                .build();
        supplierRepository.save(supplier);

        Delivery delivery = Delivery.builder()
                .quantity(100)
                .organisation(organisation)
                .supplier(supplier)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery);




    }
}
