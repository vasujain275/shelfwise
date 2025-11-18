package in.dipr.library.services.impl;

import in.dipr.library.dtos.UserDTO;
import in.dipr.library.mapper.UserMapper;
import in.dipr.library.services.AuthenticationService;
import in.dipr.library.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import in.dipr.library.dtos.AuthenticationResponse;
import in.dipr.library.dtos.LoginRequest;
import in.dipr.library.exceptions.InvalidTokenException;
import in.dipr.library.models.User;
import in.dipr.library.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    @Value("${app.cookie.domain}")
    private String cookieDomain;

    @Value("${app.cookie.secure}")
    private boolean secureCookie;

    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    /**
     * Authenticates a user and sets up their session with secure HTTP-only cookies.
     */
    public AuthenticationResponse login(LoginRequest request, HttpServletResponse response) {
        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmployeeId(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Store refresh token
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // Set secure cookies
        setCookie(response, "accessToken", accessToken, accessTokenExpiration);
        setCookie(response, "refreshToken", refreshToken, refreshTokenExpiration);

        return buildAuthenticationResponse(user);
    }

    /**
     * Refreshes the access token and updates the HTTP-only cookie.
     */
    public AuthenticationResponse refreshToken(String refreshToken, HttpServletResponse response) {
        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmployeeId(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate refresh token
        if (!refreshToken.equals(user.getRefreshToken()) || !jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        // Generate new tokens
        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        // Update refresh token
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        // Set secure cookies
        setCookie(response, "accessToken", newAccessToken, accessTokenExpiration);
        setCookie(response, "refreshToken", newRefreshToken, refreshTokenExpiration);

        return buildAuthenticationResponse(user);
    }

    /**
     * Logs out the user by clearing their session cookies and refresh token.
     */
    public void logout(String jwt, HttpServletResponse response) {
        String username = jwtService.extractUsername(jwt);
        User user = userRepository.findByEmployeeId(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clear refresh token
        user.setRefreshToken(null);
        userRepository.save(user);

        // Clear cookies
        clearCookie(response, "accessToken");
        clearCookie(response, "refreshToken");
    }

    /**
     * Retrieves the currently authenticated user's profile information.
     */
    public User getAuthenticatedUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User user = userRepository.findByEmployeeId(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }


    /**
     * Helper method to set cookies with domain and other secure attributes.
     */
    private void setCookie(HttpServletResponse response, String name, String value, long expiry) {

        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge((int) expiry);

        if (cookieDomain != null && !cookieDomain.equals("localhost")) {
            cookie.setDomain(cookieDomain);
        }

        response.addCookie(cookie);
    }

    /**
     * Helper method to clear cookies (logout).
     */
    private void clearCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        if (cookieDomain != null && !cookieDomain.equals("localhost")) {
            cookie.setDomain(cookieDomain);
        }

        response.addCookie(cookie);
    }

    private AuthenticationResponse buildAuthenticationResponse(User user) {
        return AuthenticationResponse.builder()
                .userRole(user.getUserRole().name())
                .username(user.getEmployeeId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}