package com.personalmetrics.service;

import com.personalmetrics.domain.Restaurant;
import com.personalmetrics.domain.Role;
import com.personalmetrics.domain.User;
import com.personalmetrics.dto.AuthResponse;
import com.personalmetrics.dto.LoginRequest;
import com.personalmetrics.dto.RegisterRequest;
import com.personalmetrics.repository.RestaurantRepository;
import com.personalmetrics.repository.UserRepository;
import com.personalmetrics.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final RestaurantRepository restaurantRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  @Transactional
  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));

    User user =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(() -> new IllegalStateException("User missing after authentication"));

    String token = jwtService.generateToken(user.getEmail());
    return toResponse(user, token);
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("El correo ya está registrado");
    }

    Restaurant restaurant = new Restaurant();
    restaurant.setName("Cocina de " + request.firstName());
    restaurantRepository.save(restaurant);

    User user = new User();
    user.setEmail(request.email().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setFirstName(request.firstName());
    user.setLastName(request.lastName());
    user.setRole(Role.MANAGER);
    user.setRestaurant(restaurant);
    userRepository.save(user);

    String token = jwtService.generateToken(user.getEmail());
    return toResponse(user, token);
  }

  private AuthResponse toResponse(User user, String token) {
    return new AuthResponse(
        token,
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        user.getRole().name(),
        user.getRestaurant().getName());
  }
}
