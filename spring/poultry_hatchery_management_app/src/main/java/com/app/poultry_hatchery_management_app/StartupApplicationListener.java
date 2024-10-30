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

    private final AddressRepository addressRepository;
    private final Rejection1Repository rejection1Repository;
    private final OrganisationRepository organisationRepository;
    private final SupplierRepository supplierRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final NestingRepository nestingRepository;
    private final NestingLoadedDeliveriesRepository nestingLoadedDeliveriesRepository;
    private final NestingIncubatorRepository nestingIncubatorRepository;
    private final NestingIncubatorSpaceRepository nestingIncubatorSpaceRepository;
    private final NestingTrolleyRepository nestingTrolleyRepository;
    private final NestingTrolleyIncubatorSpaceAssignmentRepository nestingTrolleyIncubatorSpaceAssignmentRepository;

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

        Address address = Address.builder()
                .city("Krakow")
                .number("99")
                .street("Warszawska")
                .postalCode("30-300")
                .build();
        addressRepository.save(address);

        Address address2 = Address.builder()
                .city("Gdynia")
                .number("11")
                .street("Morska")
                .postalCode("12-345")
                .build();
        addressRepository.save(address2);

        Address address3 = Address.builder()
                .city("Wroclaw")
                .number("33")
                .street("Sloneczna")
                .postalCode("67-890")
                .build();
        addressRepository.save(address3);

        Organisation organisation = Organisation.builder()
                .address(address)
                .regon("123456789")
                .name("A.Adamczyk sp.z.o.o.")
                .build();
        organisationRepository.save(organisation);

        User user = User.builder()
                .organisation(organisation)
                .emailAddress("string@email.com")
                .phoneNumber("111 222 333")
                .firstName("user")
                .lastName("user")
                .password(passwordEncoder.encode("string"))
                .role(Role.ADMIN)
                .isEnabled(true)
                .build();
        userRepository.save(user);

        for (int i = 0; i < 7; i++) {
            User tmp = User.builder()
                    .organisation(organisation)
                    .emailAddress("dragon" + i + "@email.com")
                    .firstName("Tohru")
                    .lastName("Kobayashi")
                    .phoneNumber("111 222 333")
                    .isEnabled(true)
                    .password(passwordEncoder.encode("dragon"))
                    .role(Role.USER)
                    .build();
            userRepository.save(tmp);
        }

        Supplier supplier = Supplier.builder()
                .WNI("wni-example")
                .surname("surname-example")
                .name("name-example")
                .address(address2)
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier);

        Supplier supplier2 = Supplier.builder()
                .WNI("wni-example")
                .surname("surname-example")
                .name("name-example")
                .address(address3)
                .organisation(organisation)
                .build();
        supplierRepository.save(supplier2);

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

        NestingLoadedDeliveries nestingLoadedDeliveries = NestingLoadedDeliveries.builder()
                .nesting(nesting)
                .delivery(delivery)
                .build();
        nestingLoadedDeliveriesRepository.save(nestingLoadedDeliveries);

        NestingIncubator nestingIncubator = NestingIncubator.builder()
                .maxCapacity(16)
                .organisation(organisation)
                .humanReadableId("L1")
                .build();
        nestingIncubatorRepository.save(nestingIncubator);

        NestingIncubatorSpace nestingIncubatorSpace = NestingIncubatorSpace.builder()
                .nestingIncubator(nestingIncubator)
                .isCurrentlyOccupied(true)
                .humanReadableId("InA1")
                .build();
        nestingIncubatorSpaceRepository.save(nestingIncubatorSpace);

        NestingTrolley nestingTrolley = NestingTrolley.builder()
                .humanReadableId("A1")
                .maxCapacity(128)
                .organisation(organisation)
                .build();
        nestingTrolleyRepository.save(nestingTrolley);

        NestingTrolleyIncubatorSpaceAssignment nestingTrolleyIncubatorSpaceAssignment =
                NestingTrolleyIncubatorSpaceAssignment.builder()
                        .nestingTrolley(nestingTrolley)
                        .nestingIncubatorSpace(nestingIncubatorSpace)
                        .trolleyEntryStamp(LocalDateTime.now())
                        .trolleyExitStamp(null)
                        .build();
        nestingTrolleyIncubatorSpaceAssignmentRepository
                .save(nestingTrolleyIncubatorSpaceAssignment);

    }
}
