package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.*;
import com.app.poultry_hatchery_management_app.model.Address;
import com.app.poultry_hatchery_management_app.model.Organisation;
import com.app.poultry_hatchery_management_app.model.Role;
import com.app.poultry_hatchery_management_app.model.User;
import com.app.poultry_hatchery_management_app.repository.AddressRepository;
import com.app.poultry_hatchery_management_app.repository.OrganisationRepository;
import com.app.poultry_hatchery_management_app.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.apache.commons.math3.analysis.function.Add;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final OrganisationRepository organisationRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();

            User newUser = User.builder()
                    .firstName(request.firstName())
                    .lastName(request.lastName())
                    .emailAddress(request.emailAddress())
                    .phoneNumber(request.phoneNumber())
                    .password(passwordEncoder.encode(request.password()))
                    .role(Role.USER)
                    .organisation(organisation)
                    .isEnabled(true)
                    .build();
            userRepository.save(newUser);
            return Optional.of(newUser);
        }
        return Optional.empty();
    }

    public Optional<User> postNewPassword(PostNewPasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmailAddress(),
                            request.oldPassword()
                    )
            );

            user.setPassword(passwordEncoder.encode(request.newPassword()));

            userRepository.save(user);

            return Optional.of(user);
        }
        return Optional.empty();
    }

    @Transactional
    public Optional<Organisation> putOrganisation(PutOrganisationDetailsRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((authentication != null && authentication.getPrincipal() instanceof UserDetails)) {
            User user = (User) authentication.getPrincipal();
            Organisation organisation = user.getOrganisation();
            Address address = organisation.getAddress();

            address.setCity(request.city());
            address.setNumber(request.number());
            address.setStreet(request.street());
            address.setPostalCode(request.postalCode());

            organisation.setName(request.name());

            addressRepository.save(address);
            organisationRepository.save(organisation);

            return Optional.of(organisation);
        }

        return Optional.empty();
    }

    public Optional<User> putUser(PutUserRequest request) {
        Optional<User> user = userRepository.findById(request.userId());
        if (user.isPresent()) {
            user.get().setFirstName(request.firstName());
            user.get().setLastName(request.lastName());
            user.get().setPhoneNumber(request.phoneNumber());
            userRepository.save(user.get());
            return user;
        }
        return Optional.empty();
    }

    public Optional<User> patchUser(PatchEmployeeRequest request) {
        User user = getUserFromSecurityContext();
        if (user != null && user.getId() != request.userId()) {
            Optional<User> userToBePatchedOpt = userRepository.findById(request.userId());
            if (userToBePatchedOpt.isPresent()) {
                User userToBePatched = userToBePatchedOpt.get();
                userToBePatched.setIsEnabled(request.isEnabled());
                userRepository.save(userToBePatched);

                return Optional.of(userToBePatched);
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
