package com.menu.qrmenu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. Admin panelinden yüklenen dinamik dosyalar için (uploads klasörü)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");

        // 2. Senin static/images altına koyduğun sabit dosyalar için
        // Spring Boot normalde bunu otomatik yapar ama garantiye alıyoruz
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
    }
}
