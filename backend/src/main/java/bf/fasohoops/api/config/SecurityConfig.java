package bf.fasohoops.api.config;

import bf.fasohoops.api.security.JwtAuthenticationFilter;
import bf.fasohoops.api.services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/api/auth/**", "/api/v1/auth/**").permitAll()
                // Public read endpoints for basketball platform
                .requestMatchers(HttpMethod.GET, "/api/v1/clubs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/offres/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/joueurs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/admin/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/evenements/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/licences/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/candidatures/**").permitAll()
                // Allow POST/PUT for form submissions (events, candidatures, licences)
                .requestMatchers(HttpMethod.POST, "/api/v1/clubs/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/evenements/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/licences/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/candidatures/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/admin/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/admin/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/v1/clubs/**").permitAll()
                // Developer tools
                .requestMatchers("/api/public/**", "/h2-console/**", "/actuator/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Protected operations (mutations, validation, etc.)
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}