package com.app.poultry_hatchery_management_app.service;

import com.app.poultry_hatchery_management_app.dto.AuthenticationRequest;
import com.app.poultry_hatchery_management_app.dto.AuthenticationResponse;
import com.app.poultry_hatchery_management_app.dto.PostRefreshTokenRequest;
import com.app.poultry_hatchery_management_app.dto.RegisterRequest;
import com.app.poultry_hatchery_management_app.model.*;
import com.app.poultry_hatchery_management_app.repository.AddressRepository;
import com.app.poultry_hatchery_management_app.repository.OrganisationRepository;
import com.app.poultry_hatchery_management_app.repository.TokenRepository;
import com.app.poultry_hatchery_management_app.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrganisationRepository organisationRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        User user = userRepository.findByEmailAddress(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String jwtToken = "Bearer " + jwtService.generateToken(new HashMap<>(), user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        Address address = Address.builder()
                .postalCode(request.orgPostalCode())
                .street(request.orgStreet())
                .number(request.orgNumber())
                .city(request.orgCity())
                .build();
        addressRepository.save(address);

        Organisation organisation = Organisation.builder()
                .name(request.orgName())
                .address(address)
                .regon(request.orgRegon())
                .build();
        organisationRepository.save(organisation);

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .emailAddress(request.emailAddress())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .organisation(organisation)
                .build();
        userRepository.save(user);

        String jwtToken = "Bearer " + jwtService.generateToken(new HashMap<>(), user);
        String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public ResponseEntity<AuthenticationResponse> refreshToken(
            PostRefreshTokenRequest request
    ) {
        final String refreshToken = request.refreshToken();
        String userEmail = null;
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            userEmail = jwtService.extractUsername(refreshToken);
        } catch (ExpiredJwtException e) {
            log.error("Expired jwt exception");
        }

        if (userEmail != null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            Optional<Token> persistedToken = tokenRepository.findByUser((User)userDetails);
            if (jwtService.isTokenValid(refreshToken, userDetails) && persistedToken.isPresent() && persistedToken.get().isValid()) {
                revokeAllUserTokens((User)userDetails);
                String jwtToken = "Bearer " + jwtService.generateToken(new HashMap<>(), userDetails);
                String newRefreshToken = jwtService.generateRefreshToken(userDetails);
                saveUserToken((User)userDetails, jwtToken);
                AuthenticationResponse authenticationResponse = AuthenticationResponse.builder()
                        .token(jwtToken)
                        .refreshToken(newRefreshToken)
                        .build();
                return ResponseEntity.ok(authenticationResponse);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    private void saveUserToken(User user, String jwtToken) {
        String stripped = jwtToken.substring(7);
        Token token = Token.builder()
                .user(user)
                .jwtToken(stripped)
                .isValid(true)
                .tokenType("Bearer")
                .build();

        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        tokenRepository.removeAllByUser(user);
    }

}
