package in.dipr.library.configs;

import lombok.RequiredArgsConstructor;
import in.dipr.library.filters.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Central security configuration for the Library Management System.
 *
 * <p>This configuration handles:
 * <ul>
 *   <li>Disabling CSRF protection for stateless JWT APIs</li>
 *   <li>Permitting React SPA static resources (index.html, JS, CSS, assets)</li>
 *   <li>Delegating all business-level security to @PreAuthorize annotations</li>
 *   <li>Configuring stateless session management using JWT tokens</li>
 *   <li>Registering a custom JWT authentication filter</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)  // Enable @PreAuthorize annotations
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    /**
     * Configures the security filter chain:
     * <ul>
     *   <li>Disables CSRF (not needed for stateless JWT)</li>
     *   <li>Permits static SPA routes so React Router can handle client-side paths</li>
     *   <li>Allows all other requests at the web layer; method security enforces @PreAuthorize</li>
     *   <li>Sets session policy to stateless</li>
     *   <li>Adds JWT filter before username/password filter</li>
     * </ul>
     *
     * @param http the {@link HttpSecurity} builder
     * @return the {@link SecurityFilterChain} instance
     * @throws Exception if something goes wrong
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we're using tokens and not cookies for session
                .csrf(AbstractHttpConfigurer::disable)

                // Configure route-level access
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/static/**",
                                "/assets/**",
                                "/favicon.ico",
                                "/manifest.json",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/webjars/**"
                        ).permitAll()

                        // Allow all other routes through; rely on @PreAuthorize for method security
                        .anyRequest().permitAll()
                )

                // Make the session stateless: each request must carry its JWT
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Register authentication provider for username/password auth
                .authenticationProvider(authenticationProvider())

                // Add JWT validation filter before Spring Security's authentication filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Password encoder bean using BCrypt with strength 12.
     * <p>BCrypt is a robust hashing algorithm with built-in salt.
     * Strength 12 ensures strong hashing without excessive performance cost.
     *
     * @return a BCrypt {@link PasswordEncoder}
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Authentication provider integrating our UserDetailsService and password encoder.
     * <p>This provider handles:
     * <ul>
     *   <li>Loading user details from the database</li>
     *   <li>Verifying passwords with BCrypt</li>
     * </ul>
     *
     * @return a configured {@link AuthenticationProvider}
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes the {@link AuthenticationManager} for use in authentication filters and services.
     *
     * @param config the auto-configured {@link AuthenticationConfiguration}
     * @return the default {@link AuthenticationManager}
     * @throws Exception if the manager cannot be created
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}