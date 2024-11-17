package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PostCandlingNestingTrolleyAssignmentRequest;
import com.app.poultry_hatchery_management_app.dto.PostCandlingRequest;
import com.app.poultry_hatchery_management_app.dto.PutCandlingRequest;
import com.app.poultry_hatchery_management_app.model.Candling;
import com.app.poultry_hatchery_management_app.model.CandlingNestingTrolleyAssignment;
import com.app.poultry_hatchery_management_app.model.Nesting;
import com.app.poultry_hatchery_management_app.model.NestingTrolley;
import com.app.poultry_hatchery_management_app.repository.CandlingNestingTrolleyAssignmentRepository;
import com.app.poultry_hatchery_management_app.repository.CandlingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class CandlingService {

    private final CandlingRepository candlingRepository;
    private final CandlingNestingTrolleyAssignmentRepository candlingNestingTrolleyAssignmentRepository;

    private final NestingService nestingService;
    private final NestingTrolleyService nestingTrolleyService;


    public List<Candling> getCandlingByNestingId(UUID nestingId) {
        return candlingRepository.findAllByNestingId(nestingId);
    }

    public Optional<Candling> postCandling(PostCandlingRequest request) {
        Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());
        List<Candling> candlingList = candlingRepository.findAllByNestingId(request.nestingId());
        if (nesting.isPresent()) {
            Candling candling = Candling.builder()
                    .candlingNumber(candlingList.size() + 1)
                    .scheduledAt(LocalDateTime.now())
                    .nesting(nesting.get())
                    .build();
            return Optional.of(candling);
        }
        return Optional.empty();
    }

    public Optional<Candling> putCandling(PutCandlingRequest request) {
        Optional<Candling> candling = candlingRepository.findById(request.candlingId());
        Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());

        if (candling.isPresent() && nesting.isPresent()) {
            candling.get().setCandlingNumber(request.candlingNumber());
            candling.get().setNesting(nesting.get());

            candlingRepository.save(candling.get());
            return candling;
        }
        return Optional.empty();
    }

    public void deleteCandling(UUID candlingId) {
        candlingRepository.deleteById(candlingId);
    }

    public List<CandlingNestingTrolleyAssignment> getAllCandledTrolleyAssignments(UUID candlingId) {
        return candlingNestingTrolleyAssignmentRepository.findAllByCandlingId(candlingId);
    }

    public Optional<CandlingNestingTrolleyAssignment> getCandledTrolleyAssignment(UUID assignmentId) {
        return candlingNestingTrolleyAssignmentRepository.findById(assignmentId);
    }

    public Optional<CandlingNestingTrolleyAssignment> postCandledTrolleyAssignment(PostCandlingNestingTrolleyAssignmentRequest request) {
        Optional<Candling> candling = candlingRepository.findById(request.candlingId());
        Optional<NestingTrolley> trolley = nestingTrolleyService.getTrolleyById(request.nestingTrolleyId());

        if (candling.isPresent() && trolley.isPresent()) {
            CandlingNestingTrolleyAssignment cnta = CandlingNestingTrolleyAssignment.builder()
                    .candling(candling.get())
                    .nestingTrolley(trolley.get())
                    .build();
            candlingNestingTrolleyAssignmentRepository.save(cnta);

            return Optional.of(cnta);
        }
        return Optional.empty();
    }

    public void deleteCandledNestingTrolleyAssignment(UUID id) {
        candlingNestingTrolleyAssignmentRepository.deleteById(id);
    }




}
