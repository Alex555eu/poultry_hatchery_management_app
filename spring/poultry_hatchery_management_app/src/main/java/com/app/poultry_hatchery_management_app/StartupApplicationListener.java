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
    private final NestingRepository nestingRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
/*        Rejection1 rejection1 = Rejection1.builder()
                .nestingLoadedDeliveries(null)
                .quantity(10)
                .cause(RejectionCause.BRAK.verify(RejectionGroup.REJECTION_1))
                .build();
        rejection1Repository.save(rejection1);*/

        //System.out.println(RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_1).toString());
        Organisation organisation = Organisation.builder()
                .address("ul.Warszawska 99")
                .regon("123456789")
                .city("Kraków")
                .name("A.Adamczyk sp.z.o.o.")
                .postalCode("11-111")
                .build();
        organisationRepository.save(organisation);

        User user = User.builder()
                .organisation(organisation)
                .emailAddress("user")
                .firstName("user")
                .lastName("user")
                .password(passwordEncoder.encode("password"))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        Supplier supplier = Supplier.builder()
                .WNI("wni-example")
                .surname("surname-example")
                .name("name-example")
                .address("address-example")
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier);

        Supplier supplier2 = Supplier.builder()
                .WNI("wni-example")
                .surname("surname-example")
                .name("name-example")
                .address("address-example")
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier2);

        Supplier supplier3 = Supplier.builder()
                .WNI("wni-example")
                .surname("surname-example")
                .name("name-example")
                .address("address-example")
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier3);

        Delivery delivery = Delivery.builder()
                .quantity(111)
                .supplier(supplier)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery);

        Delivery delivery2 = Delivery.builder()
                .quantity(222)
                .supplier(supplier2)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery2);

        Nesting nesting = Nesting.builder()
                .organisation(organisation)
                .title("New Nesting")
                .description("Lots of new eggs to nest")
                .dateTime(LocalDateTime.now())
                .build();
        nestingRepository.save(nesting);

    }
}
