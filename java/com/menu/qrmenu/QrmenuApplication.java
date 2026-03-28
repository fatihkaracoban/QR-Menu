package com.menu.qrmenu;

import org.h2.server.web.JakartaWebServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean; // 'JakartaWebServlet' olmasına dikkat!

@SpringBootApplication
public class QrmenuApplication {

    public static void main(String[] args) {
        SpringApplication.run(QrmenuApplication.class, args);
    }

    @Bean
    public ServletRegistrationBean<JakartaWebServlet> h2ConsoleServletRegistration() {
        ServletRegistrationBean<JakartaWebServlet> registration
                = new ServletRegistrationBean<>(new JakartaWebServlet());
        registration.addUrlMappings("/h2-console/*");
        return registration;
    }
}
