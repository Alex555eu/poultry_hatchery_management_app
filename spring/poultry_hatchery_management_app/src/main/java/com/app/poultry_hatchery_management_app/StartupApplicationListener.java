package com.app.poultry_hatchery_management_app;

import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.*;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@AllArgsConstructor
@Component
public class StartupApplicationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final Rejection1Repository rejection1Repository;
    private final OrganisationRepository organisationRepository;
    private final SupplierRepository supplierRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier);

        Delivery delivery = Delivery.builder()
                .quantity(100)
                .supplier(supplier)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery);

        Delivery delivery2 = Delivery.builder()
                .quantity(102)
                .supplier(null)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery2);

        User user = User.builder()
                .organisation(organisation)
                .emailAddress("user@email.com")
                .firstName("user")
                .lastName("user")
                .password(passwordEncoder.encode("password"))
                .role(Role.USER)
                .build();
        userRepository.save(user);


    }
}
