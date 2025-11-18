package in.dipr.library.controllers;

import in.dipr.library.dtos.AuthenticationResponse;
import in.dipr.library.dtos.LoginRequest;
import in.dipr.library.dtos.UserDTO;
import in.dipr.library.mapper.UserMapper;
import in.dipr.library.models.User;
import in.dipr.library.response.CustomApiResponse;
import in.dipr.library.response.ResponseUtil;
import in.dipr.library.services.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller for handling login, logout, and token refresh operations.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Auth", description = "Endpoints for user authentication and authorization")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserMapper userMapper;

    // User login
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns access and refresh tokens.")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<CustomApiResponse<AuthenticationResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        log.info("Attempting login for user: {}", loginRequest.getUsername());
        AuthenticationResponse authResponse = authenticationService.login(loginRequest, response);
        return ResponseUtil.ok(authResponse, "Login successful");
    }

    // Refresh access token
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Refreshes an expired access token using a valid refresh token.")
    @ApiResponse(responseCode = "200", description = "Token refreshed successfully")
    @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    public ResponseEntity<CustomApiResponse<AuthenticationResponse>> refreshToken(
            @CookieValue("refreshToken") String refreshToken,
            HttpServletResponse response) {
        log.info("Attempting to refresh access token");
        AuthenticationResponse authResponse = authenticationService.refreshToken(refreshToken, response);
        return ResponseUtil.ok(authResponse, "Token refreshed successfully");
    }

    // User logout
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logs out the current user by invalidating their tokens.")
    @ApiResponse(responseCode = "200", description = "Logout successful")
    public ResponseEntity<CustomApiResponse<Void>> logout(
            @CookieValue("accessToken") String accessToken,
            HttpServletResponse response) {
        log.info("Attempting to logout");
        authenticationService.logout(accessToken, response);
        return ResponseUtil.ok(null, "Logout successful");
    }

    // Check authentication status
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check authentication status", description = "Checks if the current user is authenticated.")
    @ApiResponse(responseCode = "200", description = "User is authenticated")
    @ApiResponse(responseCode = "401", description = "User is not authenticated")
    public ResponseEntity<CustomApiResponse<String>> checkAuthStatus() {
        return ResponseUtil.ok("Authenticated");
    }

    // Get current user profile
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user profile", description = "Retrieves the profile of the currently authenticated user.")
    @ApiResponse(responseCode = "200", description = "User profile retrieved successfully")
    @ApiResponse(responseCode = "401", description = "User is not authenticated")
    public ResponseEntity<CustomApiResponse<UserDTO>> getAuthenticatedUser() {
        log.debug("Fetching profile for current user");
        User user = authenticationService.getAuthenticatedUser();
        UserDTO userDTO = userMapper.toDto(user);
        return ResponseUtil.ok(userDTO);
    }
}
