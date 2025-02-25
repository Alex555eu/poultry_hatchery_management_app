package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final HatchingService hatchingService;
    private final NestingService nestingService;

    private final NestingTrolleyContentRepository nestingTrolleyContentRepository;
    private final NestingLoadedDeliveriesRepository nestingLoadedDeliveriesRepository;
    private final CandlingNestingTrolleyAssignmentRepository candlingNestingTrolleyAssignmentRepository;
    private final HatchingResultRepository hatchingResultRepository;


    public List<RejectionCause> getAllPossibleRejectionCauses() {
        return Arrays.stream(RejectionCause.values()).toList();
    }

    public List<RejectionCause> getPossibleRejection1Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_1);
    }

    public List<Rejection1> getAllRejections1ByNestingId(UUID nestingId) {
        return rejection1Repository.findAllByNestingId(nestingId);
    }

    @Transactional
    public Optional<Rejection1> postRejection1(PostRejection1Request request) {
        Optional<NestingLoadedDeliveries> deliveryOpt =
                nestingLoadedDeliveriesRepository.findById(request.nestingLoadedDeliveriesId());

        if(deliveryOpt.isPresent()){
            NestingLoadedDeliveries nld = deliveryOpt.get();
            Rejection1 rejection1 = Rejection1.builder()
                    .nestingLoadedDeliveries(nld)
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_1))
                    .build();
            rejection1Repository.save(rejection1);

            nld.setQuantity(nld.getQuantity() + request.quantity());
            nestingLoadedDeliveriesRepository.save(nld);

            return Optional.of(rejection1);
        }
        return Optional.empty();
    }

//    public Optional<Rejection1> putRejection1(PutRejectionRequest request) {
//        Optional<Rejection1> rejection1 = rejection1Repository.findById(request.rejectionId());
//        if (rejection1.isPresent()) {
//            rejection1.get().setQuantity(request.quantity());
//            rejection1.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_1));
//            rejection1Repository.save(rejection1.get());
//
//            return rejection1;
//        }
//        return Optional.empty();
//    }

    @Transactional
    public void deleteRejection1ById(UUID rejectionId) {
        Optional<Rejection1> rejection1Opt =
                rejection1Repository.findById(rejectionId);
        if(rejection1Opt.isPresent()){
            Rejection1 rejection = rejection1Opt.get();
            NestingLoadedDeliveries nld = rejection.getNestingLoadedDeliveries();

            nld.setQuantity(nld.getQuantity() - rejection.getQuantity());
            nestingLoadedDeliveriesRepository.save(nld);

            rejection1Repository.deleteById(rejectionId);
            rejection1Repository.flush();

        }
    }



    public List<Rejection2> getAllRejections2ByCandlingId(UUID candlingId) {
        return rejection2Repository.findAllByCandlingId(candlingId);
    }

    public List<Rejection2> getAllRejections2ByNestingId(UUID nestingId) {
        return rejection2Repository.findAllByNestingId(nestingId);
    }

    public List<RejectionCause> getPossibleRejection2Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_2);
    }

    @Transactional
    public Optional<Rejection2> postRejection2(PostRejection2Request request) {
        Optional<NestingLoadedDeliveries> deliveryOpt =
                nestingLoadedDeliveriesRepository.findById(request.nestingLoadedDeliveryId());

        Optional<CandlingNestingTrolleyAssignment> assignmentOpt =
                candlingNestingTrolleyAssignmentRepository.findById(request.candlingNestingTrolleyAssignmentId());

        if(assignmentOpt.isPresent() && deliveryOpt.isPresent()){

            Optional<NestingTrolleyContent> contentOpt =
                    nestingTrolleyContentRepository.findByNestingTrolleyIdAndNestingLoadedDeliveriesId(assignmentOpt.get().getNestingTrolley().getId(), deliveryOpt.get().getId());

            if (contentOpt.isPresent() && (request.quantity() <= contentOpt.get().getQuantity())) {

                NestingTrolleyContent content = contentOpt.get();
                CandlingNestingTrolleyAssignment assignment = assignmentOpt.get();

                Rejection2 rejection2 = Rejection2.builder()
                        .candlingNestingTrolleyAssignment(assignment)
                        .nestingLoadedDeliveries(content.getNestingLoadedDeliveries())
                        .quantity(request.quantity())
                        .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_2))
                        .build();
                rejection2Repository.save(rejection2);

                if (request.quantity().equals(contentOpt.get().getQuantity())) {
                    nestingTrolleyContentRepository.deleteById(content.getId());
                    nestingTrolleyContentRepository.flush();
                } else {
                    content.setQuantity(content.getQuantity() - request.quantity());
                    nestingTrolleyContentRepository.save(content);
                }
                return Optional.of(rejection2);
            }
        }
        return Optional.empty();
    }
//    public Optional<Rejection2> putRejection2(PutRejectionRequest request) {
//        Optional<Rejection2> rejection2 = rejection2Repository.findById(request.rejectionId());
//        if (rejection2.isPresent()) {
//            rejection2.get().setQuantity(request.quantity());
//            rejection2.get().setCause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_2));
//            rejection2Repository.save(rejection2.get());
//
//            return rejection2;
//        }
//        return Optional.empty();
//    }
    public void deleteRejection2ById(UUID rejectionId) {
        Optional<Rejection2> rejectionOpt = rejection2Repository.findById(rejectionId);

        if (rejectionOpt.isPresent()) {
            Rejection2 rejection = rejectionOpt.get();

            NestingTrolley trolley = rejection.getCandlingNestingTrolleyAssignment().getNestingTrolley();
            Integer contentQuantityTotal =
                    nestingTrolleyContentRepository.findAllByNestingTrolleyId(trolley.getId()).stream().mapToInt(NestingTrolleyContent::getQuantity).reduce(0, Integer::sum);

            NestingLoadedDeliveries delivery = rejection.getNestingLoadedDeliveries();
            Optional<NestingTrolleyContent> contentOpt =
                    nestingTrolleyContentRepository.findByNestingTrolleyIdAndNestingLoadedDeliveriesId(trolley.getId(), delivery.getId());

            if (rejection.getQuantity() <= (trolley.getMaxCapacity() - contentQuantityTotal)) {
                NestingTrolleyContent content;
                if (contentOpt.isPresent()) {
                    content = contentOpt.get();
                    content.setQuantity(content.getQuantity() + rejection.getQuantity());
                } else {
                    content = NestingTrolleyContent.builder()
                            .nestingTrolley(trolley)
                            .nestingLoadedDeliveries(delivery)
                            .quantity(rejection.getQuantity())
                            .build();
                }
                nestingTrolleyContentRepository.save(content);
                nestingTrolleyContentRepository.flush();

                rejection2Repository.deleteById(rejection.getId());
                rejection2Repository.flush();

                return;
            }
            throw new IllegalStateException();
        }
        throw new IllegalArgumentException();
    }



    public List<Rejection3> getAllRejections3ByNestingId(UUID nestingId) {
        return rejection3Repository.findAllByNestingId(nestingId);
    }

    public List<Rejection3> getAllRejections3ByHatchingId(UUID hatchingId) {
        return rejection3Repository.findAllByHatchingId(hatchingId);
    }

    public List<RejectionCause> getPossibleRejection3Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_3);
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

    public void deleteRejection3ById(UUID rejectionId) {
        rejection3Repository.deleteById(rejectionId);
    }



    public List<Rejection4> getAllRejections4ByNestingId(UUID nestingId) {
        return rejection4Repository.findAllByNestingId(nestingId);
    }

    public List<RejectionCause> getPossibleRejection4Causes() {
        return RejectionCause.getAvailableCauses(RejectionGroup.REJECTION_4);
    }

    @Transactional
    public Optional<Rejection4> postRejection4(PostRejection4Request request) {
        Optional<HatchingResult> resultOpt =
                hatchingService.getHatchingResultsById(request.hatchingResultId());
        if(resultOpt.isPresent()) {
            HatchingResult result = resultOpt.get();

            Rejection4 rejection4 = Rejection4.builder()
                    .hatchingResult(result)
                    .quantity(request.quantity())
                    .cause(RejectionCause.valueOf(request.cause()).verify(RejectionGroup.REJECTION_4))
                    .build();
            rejection4Repository.save(rejection4);

            result.setQuantity(result.getQuantity() - request.quantity());
            hatchingResultRepository.save(result);

            return Optional.of(rejection4);
        }
        return Optional.empty();
    }

    @Transactional
    public void deleteRejection4ById(UUID rejectionId) {
        Optional<Rejection4> rejectionOpt = rejection4Repository.findById(rejectionId);
        Optional<HatchingResult> resultOpt =
                hatchingService.getHatchingResultsById(rejectionOpt.get().getHatchingResult().getId());
        if (resultOpt.isPresent()) {
            Rejection4 rejection = rejectionOpt.get();
            HatchingResult result = resultOpt.get();

            result.setQuantity(result.getQuantity() + rejection.getQuantity());
            hatchingResultRepository.save(result);

            rejection4Repository.deleteById(rejectionId);
        }
    }



    public List<RejectionUnexpected> getAllUnexpectedRejectionsByNestingId(UUID nestingId) {
        return rejectionUnexpectedRepository.findAllByNestingId(nestingId);
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

    public void deleteUnexpectedRejectionById(UUID rejectionId) {
        rejectionUnexpectedRepository.deleteById(rejectionId);
    }

}
