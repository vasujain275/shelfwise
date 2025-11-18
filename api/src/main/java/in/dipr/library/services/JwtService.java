package in.dipr.library.services;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;
import java.util.Date;

public interface JwtService {

    /**
     * Extracts the username (subject) from the given JWT token.
     *
     * @param token the JWT token
     * @return the username
     */
    String extractUsername(String token);

    /**
     * Extracts a specific claim from the token using a resolver function.
     *
     * @param token the JWT token
     * @param claimsResolver the function to extract the desired claim
     * @param <T> the type of the claim
     * @return the claim extracted
     */
    <T> T extractClaim(String token, Function<io.jsonwebtoken.Claims, T> claimsResolver);

    /**
     * Generates a new access token for the given user.
     *
     * @param userDetails the user details
     * @return the JWT access token
     */
    String generateAccessToken(UserDetails userDetails);

    /**
     * Generates a new refresh token for the given user.
     *
     * @param userDetails the user details
     * @return the JWT refresh token
     */
    String generateRefreshToken(UserDetails userDetails);

    /**
     * Generates a new JWT token with custom claims and expiration.
     *
     * @param extraClaims additional claims to embed in the token
     * @param userDetails the user details
     * @param expiration expiration time in milliseconds
     * @return the JWT token
     */
    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration);

    /**
     * Validates the JWT token against the given user details.
     *
     * @param token the JWT token
     * @param userDetails the user details
     * @return true if the token is valid, false otherwise
     */
    boolean isTokenValid(String token, UserDetails userDetails);
}
