package com.asilo.cabeza_algodon_api.security;

import com.asilo.cabeza_algodon_api.repository.PersonalUsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final PersonalUsuarioRepository usuarioRepository;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, PersonalUsuarioRepository usuarioRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.usuarioRepository = usuarioRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 1. Endpoints públicos: Autenticación
                .requestMatchers("/api/v1/auth/**").permitAll()

                // 2. Módulo 4: Financiero, Caja, Gastos y Donaciones (Estrictamente ADMINISTRADOR)
                // Módulo 4: Financiero, Caja, Gastos y Donaciones
                .requestMatchers("/api/v1/caja/**").hasAnyRole("ADMINISTRADOR", "COORD_FUNDACION")
                .requestMatchers("/api/v1/facturacion/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/v1/donaciones/**").hasAnyRole("ADMINISTRADOR", "COORD_FUNDACION")
                .requestMatchers("/api/v1/gastos/**").hasAnyRole("ADMINISTRADOR", "COORD_FUNDACION")
                .requestMatchers("/api/v1/reportes/**").hasAnyRole("ADMINISTRADOR", "COORD_FUNDACION")

                // 3. Módulos 1 y 2: Residentes (Internos) y Derivaciones Médicas
                .requestMatchers("/api/v1/internos/**").hasAnyRole(
                    "ADMINISTRADOR", "MEDICO_GENERAL", "ENFERMERO", 
                    "COORD_FUNDACION", "MEDICO_ESPECIALISTA", "LABORATORISTA", "FARMACEUTICO"
                )
                .requestMatchers("/api/v1/referencias/**").hasAnyRole(
                    "ADMINISTRADOR", "MEDICO_GENERAL", "ENFERMERO", "COORD_FUNDACION"
                )

                // 4. Módulo 3: Servicios Fundación (Supervisión, Laboratorio y Farmacia)
                .requestMatchers("/api/v1/laboratorio/**").hasAnyRole(
                    "ADMINISTRADOR", "COORD_FUNDACION", "MEDICO_ESPECIALISTA", "LABORATORISTA"
                )
                .requestMatchers("/api/v1/farmacia/**").hasAnyRole(
                    "ADMINISTRADOR", "COORD_FUNDACION", "MEDICO_ESPECIALISTA", "FARMACEUTICO"
                )

                // 5. Resto de la aplicación: Requiere cualquier usuario autenticado
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "https://asilo-cabeza-algodon.vercel.app"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByCorreo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}