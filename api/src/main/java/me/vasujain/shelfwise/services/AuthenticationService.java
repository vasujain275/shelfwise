package me.vasujain.shelfwise.services;

import me.vasujain.shelfwise.dtos.AuthenticationResponse;
import me.vasujain.shelfwise.dtos.LoginRequest;
import me.vasujain.shelfwise.dtos.UserDTO;
import me.vasujain.shelfwise.models.User;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {

    /**
     * Authenticates a user with their credentials and sets HTTP-only access and refresh tokens as cookies.
     *
     * @param request  the login request containing username and password
     * @param response the HTTP response to which cookies will be added
     * @return an authentication response with user and token info
     */
    AuthenticationResponse login(LoginRequest request, HttpServletResponse response);

    /**
     * Refreshes the access token using a valid refresh token and updates the cookies.
     *
     * @param refreshToken the refresh token
     * @param response     the HTTP response to which new cookies will be added
     * @return an authentication response with user and new access token
     */
    AuthenticationResponse refreshToken(String refreshToken, HttpServletResponse response);

    /**
     * Logs out the user by clearing cookies and removing their refresh token from the database.
     *
     * @param jwt      the JWT token used to identify the user
     * @param response the HTTP response to which cookie-clearing commands will be added
     */
    void logout(String jwt, HttpServletResponse response);

    /**
     * Retrieves the currently authenticated user's profile information.
     *
     * @return a DTO with the authenticated user's details
     */
    User getAuthenticatedUser();
}
