package com.app.poultry_hatchery_management_app;

import com.app.poultry_hatchery_management_app.dto.PostCandlingRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.*;
import com.app.poultry_hatchery_management_app.service.CandlingService;
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
    private final Rejection2Repository rejection2Repository;
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
    private final CandlingRepository candlingRepository;
    private final CandlingNestingTrolleyAssignmentRepository candlingNestingTrolleyAssignmentRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {

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
                .productType(type)
                .supplier(supplier)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery);

        Delivery delivery2 = Delivery.builder()
                .quantity(222)
                .productType(type)
                .supplier(supplier2)
                .dateTime(LocalDateTime.now())
                .build();
        deliveryRepository.save(delivery2);

        Nesting nesting = Nesting.builder()
                .organisation(organisation)
                .title("New Nesting")
                .description("Lots of new eggs to nest")
                .dateTime(LocalDateTime.now())
                .isFinished(false)
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

        for(int i = 1; i < 16; i++) {
            NestingIncubatorSpace nestingIncubatorSpace = NestingIncubatorSpace.builder()
                    .nestingIncubator(nestingIncubator)
                    .isCurrentlyOccupied(true)
                    .humanReadableId("S" + (i+1))
                    .build();
            nestingIncubatorSpaceRepository.save(nestingIncubatorSpace);
        }

        NestingIncubatorSpace nestingIncubatorSpace = NestingIncubatorSpace.builder()
                .nestingIncubator(nestingIncubator)
                .isCurrentlyOccupied(false)
                .humanReadableId("S1")
                .build();
        nestingIncubatorSpaceRepository.save(nestingIncubatorSpace);

        NestingTrolley nestingTrolley = NestingTrolley.builder()
                .humanReadableId("A1")
                .maxCapacity(128)
                .organisation(organisation)
                .build();
        nestingTrolleyRepository.save(nestingTrolley);

        NestingTrolley nestingTrolley2 = NestingTrolley.builder()
                .humanReadableId("A2")
                .maxCapacity(128)
                .organisation(organisation)
                .build();
        nestingTrolleyRepository.save(nestingTrolley2);

        NestingTrolleyContent nestingTrolleyContent = NestingTrolleyContent.builder()
                .nestingLoadedDeliveries(nestingLoadedDeliveries)
                .nestingTrolley(nestingTrolley)
                .quantity(124)
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

        Task toBeAssigned = Task.builder()
                .taskStatus(TaskStatus.NOT_STARTED)
                .executionScheduledAt(LocalDateTime.now())
                .organisation(organisation)
                .taskType(taskType4)
                .nesting(nesting)
                .comment(nesting.getTitle() + " " + LocalDateTime.now())
                .build();
        taskRepository.save(toBeAssigned);

        List<NestingTrolley> trolleys2 = nestingTrolleyRepository.findAllTrolleysByNestingId(nesting.getId());
        for(NestingTrolley trolley : trolleys2) {
            TaskNestingTrolleyAssignment assignment = TaskNestingTrolleyAssignment.builder()
                    .task(toBeAssigned)
                    .isTaskCompleted(false)
                    .nestingTrolley(trolley)
                    .executor(null)
                    .build();
            taskNestingTrolleyAssignmentRepository.save(assignment);
        }

        Candling candling = Candling.builder()
                .candlingNumber(1)
                .createdAt(LocalDateTime.now())
                .nesting(nesting)
                .organisation(organisation)
                .task(toBeAssigned)
                .build();
        candlingRepository.save(candling);

        CandlingNestingTrolleyAssignment cnta = CandlingNestingTrolleyAssignment.builder()
                .candling(candling)
                .nestingTrolley(nestingTrolley)
                .build();
        candlingNestingTrolleyAssignmentRepository.save(cnta);

        Rejection2 rejection2 = Rejection2.builder()
                .candlingNestingTrolleyAssignment(cnta)
                .nestingLoadedDeliveries(nestingLoadedDeliveries)
                .cause(RejectionCause.STLUCZKA)
                .quantity(1)
                .build();
        rejection2Repository.save(rejection2);

    }
}
