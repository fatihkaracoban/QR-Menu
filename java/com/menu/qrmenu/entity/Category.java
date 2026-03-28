package com.menu.qrmenu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Örn: Tatlılar
    private String slug;        // Örn: tatlilar (URL için)
    private String image;       // Kategori kartı resmi
    private Integer orderIndex; // Kategorilerin sıralaması için
}