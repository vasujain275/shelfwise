// UserController.java
package me.vasujain.shelfwise.controllers;

import me.vasujain.shelfwise.dtos.*;
import me.vasujain.shelfwise.enums.UserStatus;
import me.vasujain.shelfwise.response.CustomApiResponse;
import me.vasujain.shelfwise.response.ResponseUtil;
import me.vasujain.shelfwise.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Users", description = "Endpoints for managing users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Register a new user", description = "Registers a new user in the system.")
    @ApiResponse(responseCode = "201", description = "User registered successfully")
    @ApiResponse(responseCode = "400", description = "Invalid user data")
    public ResponseEntity<CustomApiResponse<UserDTO>> registerUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        log.info("Registering new user with employee ID: {}", userCreateDTO.getEmployeeId());
        UserDTO createdUser = userService.registerUser(userCreateDTO);
        return ResponseUtil.created(createdUser, "User registered successfully");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get user by ID", description = "Retrieves a user by their unique ID.")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<CustomApiResponse<UserDTO>> getUser(@PathVariable UUID id) {
        log.debug("Fetching user with ID: {}", id);
        UserDTO user = userService.getUser(id);
        return ResponseUtil.ok(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get all users", description = "Retrieves a paginated list of all users.")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    public ResponseEntity<CustomApiResponse<List<UserDTO>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDir) {

        log.debug("Fetching all users");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<UserDTO> result = userService.getAllUsers(pageable);
        return ResponseUtil.okPage(result);
    }

    /**
     * Unified search endpoint for users.
     * Searches against name, employee ID, email, department, and division.
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Search for users", description = "Searches for users based on a query string.")
    @ApiResponse(responseCode = "200", description = "Users found")
    public ResponseEntity<CustomApiResponse<List<UserDTO>>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fullName") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction sortDir) {
        log.debug("Searching users with query: '{}'", query);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sortBy));
        Page<UserDTO> result = userService.search(query, pageable);
        return ResponseUtil.okPage(result);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update a user", description = "Updates an existing user's information.")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<CustomApiResponse<UserDTO>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        log.info("Updating user with ID: {}", id);
        UserDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        return ResponseUtil.ok(updatedUser, "User updated successfully");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user status", description = "Updates the status of a user (e.g., ACTIVE, INACTIVE, SUSPENDED).")
    @ApiResponse(responseCode = "200", description = "User status updated successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<CustomApiResponse<UserDTO>> updateUserStatus(
            @PathVariable UUID id,
            @RequestParam UserStatus status) {
        log.info("Updating status for user ID: {} to {}", id, status);
        UserDTO updatedUser = userService.updateUserStatus(id, status);
        return ResponseUtil.ok(updatedUser, "User status updated successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete a user", description = "Soft-deletes a user from the system.")
    @ApiResponse(responseCode = "200", description = "User soft-deleted successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<CustomApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        log.info("Soft deleting user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseUtil.ok(null, "User soft-deleted successfully");
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change current user's password", description = "Allows the authenticated user to change their own password.")
    @ApiResponse(responseCode = "200", description = "Password changed successfully")
    @ApiResponse(responseCode = "400", description = "Invalid password data")
    public ResponseEntity<CustomApiResponse<Void>> changePassword(@Valid @RequestBody PasswordUpdateDTO passwordUpdateDTO) {
        log.info("Changing password for current user");
        userService.changePassword(passwordUpdateDTO);
        return ResponseUtil.ok(null, "Password changed successfully");
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Reset a user's password", description = "Allows an admin to reset a user's password.")
    @ApiResponse(responseCode = "200", description = "Password reset successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<CustomApiResponse<Void>> resetPassword(
            @PathVariable UUID id,
            @Valid @RequestBody PasswordResetDTO passwordResetDTO) {
        log.info("Resetting password for user ID: {}", id);
        userService.resetPassword(id, passwordResetDTO);
        return ResponseUtil.ok(null, "Password reset successfully");
    }
}