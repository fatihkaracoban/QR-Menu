package com.menu.qrmenu.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // API isteklerini engellememesi için
                .authorizeHttpRequests(auth -> auth
                // 1. HERKESE AÇIK OLAN YERLER (Müşteriler)
                .requestMatchers("/", "/index.html", "/kategori.html", "/kategori").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/products/**", "/api/categories/**").permitAll()
                // 2. SADECE ADMİNLERE AÇIK OLAN YERLER (Controller'daki /admin yolu)
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/products/**", "/products/upload", "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/products/**", "/api/categories/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                )
                .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/admin", true)
                .permitAll()
                )
                .logout(logout -> logout
                .logoutSuccessUrl("/") // Çıkış yapınca ana sayfaya at
                .permitAll()
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 1. Kullanıcı: Sen
        UserDetails fatih = User.builder()
                .username("user")
                .password("{noop}user123")
                .roles("ADMIN")
                .build();

        // 2. Kullanıcı: Pastane Sahibi
        UserDetails patron = User.builder()
                .username("boss")
                .password("{noop}boss123")
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(fatih, patron);
    }
}
