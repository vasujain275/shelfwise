// UserService.java
package in.dipr.library.services;

import in.dipr.library.dtos.UserCreateDTO;
import in.dipr.library.dtos.UserDTO;
import in.dipr.library.dtos.UserUpdateDTO;
import in.dipr.library.dtos.PasswordUpdateDTO;
import in.dipr.library.dtos.PasswordResetDTO;
import in.dipr.library.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Service interface for managing users in the library system.
 * Handles user registration, profile management, and a unified search.
 */
public interface UserService {

    /**
     * Registers a new user.
     * @param userCreateDTO Data for creating the user.
     * @return The created user's DTO.
     */
    UserDTO registerUser(UserCreateDTO userCreateDTO);

    /**
     * Updates an existing user's profile information.
     * @param id The UUID of the user to update.
     * @param userUpdateDTO Data for the update.
     * @return The updated user's DTO.
     */
    UserDTO updateUser(UUID id, UserUpdateDTO userUpdateDTO);

    /**
     * Retrieves a user by their unique ID.
     * @param id The UUID of the user.
     * @return The user's DTO.
     */
    UserDTO getUser(UUID id);

    /**
     * Retrieves a user by their employee ID.
     * @param employeeId The employee ID of the user.
     * @return The user's DTO.
     */
    UserDTO getUserByEmployeeId(String employeeId);

    

    /**
     * Retrieves all users with pagination.
     * @param pageable Pagination parameters.
     * @return A page of user DTOs.
     */
    Page<UserDTO> getAllUsers(Pageable pageable);

    /**
     * Performs a unified search for users across multiple fields:
     * full name, employee ID, email, department, and division.
     * @param query The search term.
     * @param pageable Pagination parameters.
     * @return A page of user DTOs matching the query.
     */
    Page<UserDTO> search(String query, Pageable pageable);

    /**
     * Updates a user's status (e.g., ACTIVE, SUSPENDED).
     * @param userId The UUID of the user.
     * @param status The new status.
     * @return The updated user's DTO.
     */
    UserDTO updateUserStatus(UUID userId, UserStatus status);

    /**
     * Updates a user's password after verifying the current one.
     * @param userId The UUID of the user.
     * @param passwordUpdateDTO DTO containing current and new passwords.
     * @return The updated user's DTO.
     */
    UserDTO updatePassword(UUID userId, PasswordUpdateDTO passwordUpdateDTO);

    /**
     * Soft deletes a user by marking their status as INACTIVE.
     * @param id The UUID of the user to delete.
     */
    void deleteUser(UUID id);
	
	/**
     * Changes the password for the currently authenticated user.
     *
     * @param passwordUpdateDTO DTO containing the old and new passwords.
     */
    void changePassword(PasswordUpdateDTO passwordUpdateDTO);

    /**
     * Resets the password for a given user.
     *
     * @param userId            The ID of the user whose password is to be reset.
     * @param passwordResetDTO  DTO containing the new password.
     */
    void resetPassword(UUID userId, PasswordResetDTO passwordResetDTO);
}