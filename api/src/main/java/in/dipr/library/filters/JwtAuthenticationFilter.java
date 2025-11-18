package in.dipr.library.filters;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import in.dipr.library.services.JwtService;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter responsible for JWT-based authentication in the Spring Security filter chain.
 * Handles both cookie-based and Authorization header JWT tokens.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Extract JWT from cookies or Authorization header
        String jwt = getJwtFromRequest(request);

        // If no JWT found, continue to the next filter
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract username from the JWT token
            final String username = jwtService.extractUsername(jwt);

            // Only proceed with authentication if:
            // 1. Username was successfully extracted from token
            // 2. User isn't already authenticated
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load user details from the database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Validate the token against the user details
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // credentials (null since we don't need them after authentication)
                            userDetails.getAuthorities() // user's granted authorities/roles
                    );

                    // Add request details to authentication token
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Update Security Context with the new authentication token
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

        } catch (Exception e) {
            // Log the error but don't stop the filter chain
            System.err.println("JWT Authentication error: " + e.getMessage());
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Helper method to extract JWT token from cookies or Authorization header.
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        // First, try to get JWT from cookies
        String jwt = getJwtFromCookies(request);
        if (jwt != null) {
            return jwt;
        }

        // If not found in cookies, try Authorization header
        return getJwtFromAuthorizationHeader(request);
    }

    /**
     * Extract JWT token from cookies.
     */
    private String getJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        // Look for the cookie named "accessToken"
        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    /**
     * Extract JWT token from Authorization header.
     */
    private String getJwtFromAuthorizationHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7); // Remove "Bearer " prefix
    }
}
