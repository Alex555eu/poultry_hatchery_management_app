package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.PostUserRequest;
import com.app.poultry_hatchery_management_app.dto.PutUserRequest;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.Role;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.OrganisationRepository;
import com.app.poultry_hatchery_management_app.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final PasswordEncoder passwordEncoder;

    public User getSelf() {
        return getUserFromSecurityContext();
    }

    public List<User> getAllUsers() {
        User user = getUserFromSecurityContext();
        if (user != null) {
            List<User> list = userRepository.findAllByOrganisationId(user.getOrganisation().getId());
            list.removeIf(el -> el.getId().equals(user.getId()));
            return list;
        }
        return List.of();
    }

    public Optional<User> postUser(PostUserRequest request) {
        Optional<Organisation> organisation = organisationRepository.findById(request.organisationId());
        if (organisation.isPresent()) {
            User user = User.builder()
                    .firstName(request.firstName())
                    .lastName(request.lastName())
                    .emailAddress(request.emailAddress())
                    .password(passwordEncoder.encode(request.password()))
                    .role(Role.USER)
                    .organisation(organisation.get())
                    .isEnabled(true)
                    .build();
            userRepository.save(user);
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public Optional<User> putUser(PutUserRequest request) {
        Optional<User> user = userRepository.findById(request.userId());
        if (user.isPresent()) {
            user.get().setFirstName(request.firstName());
            user.get().setLastName(request.lastName());
            userRepository.save(user.get());
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> deleteUser(UUID id) {
        User user = getUserFromSecurityContext();
        if (user != null && user.getId() != id) {
            Optional<User> userToBeDeleted = userRepository.findById(id);
            if (userToBeDeleted.isPresent()) {
                userToBeDeleted.get().setIsEnabled(false);
                userRepository.save(userToBeDeleted.get());
                return userToBeDeleted;
            }
        }
        return Optional.empty();
    }


    private User getUserFromSecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }

}
