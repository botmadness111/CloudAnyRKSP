package ru.a.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.a.project.dto.LoginRequest;
import ru.a.project.dto.RegisterRequest;
import ru.a.project.dto.AuthResponse;
import ru.a.project.model.User;
import ru.a.project.security.JwtService;
import ru.a.project.security.UserDetailsImpl;
import ru.a.project.security.service.AuthorizationService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthorizationService authorizationService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthorizationService authorizationService,
                         AuthenticationManager authenticationManager,
                         JwtService jwtService) {
        this.authorizationService = authorizationService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = authorizationService.register(
            request.getUsername(),
            request.getPassword(),
            request.getEmail(),
            request.getFullName()
        );

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getId(), userDetails.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getId(), userDetails.getUsername()));
    }
} 