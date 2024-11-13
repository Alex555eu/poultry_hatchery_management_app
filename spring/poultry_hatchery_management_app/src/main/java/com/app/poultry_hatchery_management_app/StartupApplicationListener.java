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
import java.util.List;

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
    private final ProductTypeRepository productTypeRepository;
    private final TaskTypeRepository taskTypeRepository;
    private final TaskRepository taskRepository;
    private final TaskNestingTrolleyAssignmentRepository taskNestingTrolleyAssignmentRepository;
    private final NestingTrolleyContentRepository nestingTrolleyContentRepository;

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

        ProductType type = ProductType.builder()
                .name("GES_BIALA_KOLUDZKA")
                .organisation(organisation)
                .build();
        productTypeRepository.save(type);

        Delivery delivery = Delivery.builder()
                .quantity(111)
                .type(type)
                .supplier(supplier)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery);

        Delivery delivery2 = Delivery.builder()
                .quantity(222)
                .type(type)
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

        NestingLoadedDeliveries nestingLoadedDeliveries2 = NestingLoadedDeliveries.builder()
                .nesting(nesting)
                .delivery(delivery2)
                .build();
        nestingLoadedDeliveriesRepository.save(nestingLoadedDeliveries2);

        NestingIncubator nestingIncubator = NestingIncubator.builder()
                .maxCapacity(16)
                .organisation(organisation)
                .humanReadableId("L1")
                .numberOfColumns(4)
                .build();
        nestingIncubatorRepository.save(nestingIncubator);

        NestingIncubatorSpace nestingIncubatorSpace = NestingIncubatorSpace.builder()
                .nestingIncubator(nestingIncubator)
                .isCurrentlyOccupied(true)
                .humanReadableId("S1")
                .build();
        nestingIncubatorSpaceRepository.save(nestingIncubatorSpace);

        NestingIncubatorSpace nestingIncubatorSpace2 = NestingIncubatorSpace.builder()
                .nestingIncubator(nestingIncubator)
                .isCurrentlyOccupied(false)
                .humanReadableId("S2")
                .build();
        nestingIncubatorSpaceRepository.save(nestingIncubatorSpace2);

        NestingTrolley nestingTrolley = NestingTrolley.builder()
                .humanReadableId("A1")
                .maxCapacity(128)
                .organisation(organisation)
                .build();
        nestingTrolleyRepository.save(nestingTrolley);

        NestingTrolleyContent nestingTrolleyContent = NestingTrolleyContent.builder()
                .nestingLoadedDeliveries(nestingLoadedDeliveries)
                .nestingTrolley(nestingTrolley)
                .quantity(125)
                .build();
        nestingTrolleyContentRepository.save(nestingTrolleyContent);

        NestingTrolleyContent nestingTrolleyContent2 = NestingTrolleyContent.builder()
                .nestingLoadedDeliveries(nestingLoadedDeliveries)
                .nestingTrolley(nestingTrolley)
                .quantity(3)
                .build();
        nestingTrolleyContentRepository.save(nestingTrolleyContent2);

        NestingTrolleyIncubatorSpaceAssignment nestingTrolleyIncubatorSpaceAssignment =
                NestingTrolleyIncubatorSpaceAssignment.builder()
                        .nestingTrolley(nestingTrolley)
                        .nestingIncubatorSpace(nestingIncubatorSpace)
                        .trolleyEntryStamp(LocalDateTime.now())
                        .trolleyExitStamp(null)
                        .build();
        nestingTrolleyIncubatorSpaceAssignmentRepository
                .save(nestingTrolleyIncubatorSpaceAssignment);

        TaskType taskType = TaskType.builder()
                .name("WIETRZENIE")
                .description("BRAK")
                .organisation(organisation)
                .build();
        taskTypeRepository.save(taskType);

        TaskType taskType2 = TaskType.builder()
                .name("NAWILZANIE")
                .description("BRAK")
                .organisation(organisation)
                .build();
        taskTypeRepository.save(taskType2);

        TaskType taskType3 = TaskType.builder()
                .name("PRZECHYLANIE")
                .description("BRAK")
                .organisation(organisation)
                .build();
        taskTypeRepository.save(taskType3);

        TaskType taskType4 = TaskType.builder()
                .name("SWIETLENIE")
                .description("BRAK")
                .organisation(organisation)
                .build();
        taskTypeRepository.save(taskType4);

        Task task = Task.builder()
                .taskType(taskType)
                .taskStatus(TaskStatus.NOT_STARTED)
                .executionCompletedAt(null)
                .executionScheduledAt(LocalDateTime.of(2024, 11, 14, 15, 20))
                .nesting(nesting)
                .organisation(organisation)
                .build();
        taskRepository.save(task);

        List<NestingTrolley> trolleys = nestingTrolleyRepository.findAllTrolleysByNestingId(nesting.getId());
        for(NestingTrolley trolley : trolleys) {
            TaskNestingTrolleyAssignment assignment = TaskNestingTrolleyAssignment.builder()
                    .task(task)
                    .isTaskCompleted(false)
                    .nestingTrolley(trolley)
                    .executor(null)
                    .build();
            taskNestingTrolleyAssignmentRepository.save(assignment);
        }


    }
}
