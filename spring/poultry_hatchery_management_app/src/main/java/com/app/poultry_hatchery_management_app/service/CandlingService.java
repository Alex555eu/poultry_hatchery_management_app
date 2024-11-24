package com.app.poultry_hatchery_management_app.service;


import com.app.poultry_hatchery_management_app.dto.PostCandlingNestingTrolleyAssignmentRequest;
import com.app.poultry_hatchery_management_app.dto.PostCandlingRequest;
import com.app.poultry_hatchery_management_app.dto.PutCandlingRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.CandlingNestingTrolleyAssignmentRepository;
import com.app.poultry_hatchery_management_app.repository.CandlingRepository;
import com.app.poultry_hatchery_management_app.repository.TaskRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Slf4j
public class CandlingService {

    private final CandlingRepository candlingRepository;
    private final CandlingNestingTrolleyAssignmentRepository candlingNestingTrolleyAssignmentRepository;
    private final TaskRepository taskRepository;

    private final NestingService nestingService;
    private final NestingTrolleyService nestingTrolleyService;
    private final TaskService taskService;

    public List<Candling> getAllCandlings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            return candlingRepository.findAllByOrganisationId(user.getOrganisation().getId());
        }
        return List.of();
    }

    public List<Candling> getCandlingByNestingId(UUID nestingId) {
        return candlingRepository.findAllByNestingId(nestingId);
    }

    public Optional<Candling> getCandlingById(UUID candlingId) {
        return candlingRepository.findById(candlingId);
    }

    @Transactional
    public Optional<Candling> postCandling(PostCandlingRequest request) {
        Optional<Nesting> nesting = nestingService.getNesting(request.nestingId());
        Optional<Task> task = taskService.getTaskById(request.taskId());

        if (nesting.isPresent() && task.isPresent()) {

            List<Candling> candlingList = candlingRepository.findAllByNestingId(request.nestingId());

            Candling candling = Candling.builder()
                    .candlingNumber(candlingList.size() + 1)
                    .createdAt(LocalDateTime.now())
                    .nesting(nesting.get())
                    .task(task.get())
                    .organisation(nesting.get().getOrganisation())
                    .build();
            candlingRepository.save(candling);

            List<NestingTrolley> trolleys = nestingTrolleyService.getAllTrolleysByNestingId(nesting.get().getId());
            for(NestingTrolley trolley : trolleys) {
                this.postCandledTrolleyAssignment(new PostCandlingNestingTrolleyAssignmentRequest(candling.getId(), trolley.getId()));
            }

            return Optional.of(candling);
        }
        return Optional.empty();
    }

//    public Optional<Candling> putCandling(PutCandlingRequest request) {
//        Optional<Candling> candling = candlingRepository.findById(request.candlingId());
//
//        if (candling.isPresent()) {
//            candling.get().setCandlingNumber(request.candlingNumber());
//
//            candlingRepository.save(candling.get());
//            return candling;
//        }
//        return Optional.empty();
//    }

    public void deleteCandling(UUID candlingId) {
        List<CandlingNestingTrolleyAssignment> list = this.getAllCandledTrolleyAssignments(candlingId);
        for(CandlingNestingTrolleyAssignment assignment : list) {
            this.deleteCandledNestingTrolleyAssignment(assignment.getId());
        }
        candlingNestingTrolleyAssignmentRepository.flush();
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
