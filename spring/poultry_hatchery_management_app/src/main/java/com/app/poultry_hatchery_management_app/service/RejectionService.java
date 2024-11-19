package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class RejectionService {

    private final Rejection1Repository rejection1Repository;
    private final Rejection2Repository rejection2Repository;
    private final Rejection3Repository rejection3Repository;
    private final Rejection4Repository rejection4Repository;
    private final RejectionUnexpectedRepository rejectionUnexpectedRepository;

    private final NestingLoadedDeliveriesService nestingLoadedDeliveriesService;
    private final CandlingService candlingService;
    private final HatchingService hatchingService;
    private final NestingService nestingService;

    public List<RejectionCause> getAllPossibleRejectionCauses() {
        return Arrays.stream(RejectionCause.values()).toList();
    }

    public List<RejectionCause> getPossibleRejection1Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_1);
    }

    public List<RejectionCause> getPossibleRejection2Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_2);
    }

    public List<RejectionCause> getPossibleRejection3Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_3);
    }

    public List<RejectionCause> getPossibleRejection4Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_4);
    }

    public List<Rejection1> getAllRejections1ByNestingId(UUID nestingId) {
        return rejection1Repository.findAllByNestingId(nestingId);
    }

    public List<Rejection2> getAllRejections2ByNestingId(UUID nestingId) {
        return rejection2Repository.findAllByNestingId(nestingId);
    }

    public List<Rejection3> getAllRejections3ByNestingId(UUID nestingId) {
        return rejection3Repository.findAllByNestingId(nestingId);
    }

    public List<Rejection4> getAllRejections4ByNestingId(UUID nestingId) {
        return rejection4Repository.findAllByNestingId(nestingId);
    }

    public List<RejectionUnexpected> getAllUnexpectedRejectionsByNestingId(UUID nestingId) {
        return rejectionUnexpectedRepository.findAllByNestingId(nestingId);
    }

    public Optional<Rejection1> postRejection1(PostRejection1Request request) {
        Optional<NestingLoadedDeliveries> nld =
                nestingLoadedDeliveriesService.getNestingLoadedDeliveryById(request.nestingLoadedDeliveriesId());
        if(nld.isPresent()) {
            Rejection1 rejection1 = Rejection1.builder()
                    .nestingLoadedDeliveries(nld.get())
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_1))
                    .build();
            rejection1Repository.save(rejection1);

            return Optional.of(rejection1);
        }
        return Optional.empty();
    }

    public Optional<Rejection2> postRejection2(PostRejection2Request request) {
        Optional<CandlingNestingTrolleyAssignment> assignment =
                candlingService.getCandledTrolleyAssignment(request.candlingNestingTrolleyAssignmentId());
        if(assignment.isPresent()) {
            Rejection2 rejection2 = Rejection2.builder()
                    .candlingNestingTrolleyAssignment(assignment.get())
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_2))
                    .build();
            rejection2Repository.save(rejection2);

            return Optional.of(rejection2);
        }
        return Optional.empty();
    }

    public Optional<Rejection3> postRejection3(PostRejection3Request request) {
        Optional<HatchingLoadedDeliveries> hld =
                hatchingService.getHatchingLoadedDeliveryById(request.hatchingLoadedDeliveryId());
        if(hld.isPresent()) {
            Rejection3 rejection3 = Rejection3.builder()
                    .hatchingLoadedDeliveries(hld.get())
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_3))
                    .build();
            rejection3Repository.save(rejection3);

            return Optional.of(rejection3);
        }
        return Optional.empty();
    }

    public Optional<Rejection4> postRejection4(PostRejection4Request request) {
        Optional<HatchingResult> result =
                hatchingService.getHatchingResultsById(request.hatchingResultId());
        if(result.isPresent()) {
            Rejection4 rejection4 = Rejection4.builder()
                    .hatchingResult(result.get())
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_4))
                    .build();
            rejection4Repository.save(rejection4);

            return Optional.of(rejection4);
        }
        return Optional.empty();
    }

    public Optional<RejectionUnexpected> postUnexpectedRejection(PostUnexpectedRejectionRequest request) {
        Optional<Nesting> nesting =
                nestingService.getNesting(request.nestingId());
        if(nesting.isPresent()) {
            RejectionUnexpected rejectionUnexpected = RejectionUnexpected.builder()
                    .nesting(nesting.get())
                    .timeStamp(LocalDateTime.now())
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_UNEXPECTED))
                    .build();
            rejectionUnexpectedRepository.save(rejectionUnexpected);

            return Optional.of(rejectionUnexpected);
        }
        return Optional.empty();
    }

    public Optional<Rejection1> putRejection1(PutRejectionRequest request) {
        Optional<Rejection1> rejection1 = rejection1Repository.findById(request.rejectionId());
        if (rejection1.isPresent()) {
            rejection1.get().setQuantity(request.quantity());
            rejection1.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_1));
            rejection1Repository.save(rejection1.get());

            return rejection1;
        }
        return Optional.empty();
    }

    public Optional<Rejection2> putRejection2(PutRejectionRequest request) {
        Optional<Rejection2> rejection2 = rejection2Repository.findById(request.rejectionId());
        if (rejection2.isPresent()) {
            rejection2.get().setQuantity(request.quantity());
            rejection2.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_2));
            rejection2Repository.save(rejection2.get());

            return rejection2;
        }
        return Optional.empty();
    }

    public Optional<Rejection3> putRejection3(PutRejectionRequest request) {
        Optional<Rejection3> rejection3 = rejection3Repository.findById(request.rejectionId());
        if (rejection3.isPresent()) {
            rejection3.get().setQuantity(request.quantity());
            rejection3.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_3));
            rejection3Repository.save(rejection3.get());

            return rejection3;
        }
        return Optional.empty();
    }

    public Optional<Rejection4> putRejection4(PutRejectionRequest request) {
        Optional<Rejection4> rejection4 = rejection4Repository.findById(request.rejectionId());
        if (rejection4.isPresent()) {
            rejection4.get().setQuantity(request.quantity());
            rejection4.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_4));
            rejection4Repository.save(rejection4.get());

            return rejection4;
        }
        return Optional.empty();
    }

    public Optional<RejectionUnexpected> putUnexpectedRejection(PutRejectionRequest request) {
        Optional<RejectionUnexpected> rejectionUnexpected = rejectionUnexpectedRepository.findById(request.rejectionId());
        if (rejectionUnexpected.isPresent()) {
            rejectionUnexpected.get().setQuantity(request.quantity());
            rejectionUnexpected.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_UNEXPECTED));
            rejectionUnexpectedRepository.save(rejectionUnexpected.get());

            return rejectionUnexpected;
        }
        return Optional.empty();
    }

    public void deleteRejection1ById(UUID rejectionId) {
        rejection1Repository.deleteById(rejectionId);
    }

    public void deleteRejection2ById(UUID rejectionId) {
        rejection2Repository.deleteById(rejectionId);
    }

    public void deleteRejection3ById(UUID rejectionId) {
        rejection3Repository.deleteById(rejectionId);
    }

    public void deleteRejection4ById(UUID rejectionId) {
        rejection4Repository.deleteById(rejectionId);
    }

    public void deleteUnexpectedRejectionById(UUID rejectionId) {
        rejectionUnexpectedRepository.deleteById(rejectionId);
    }

}
