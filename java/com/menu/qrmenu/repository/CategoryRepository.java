package com.menu.qrmenu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.menu.qrmenu.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // İleride slug'a göre arama yapmak istersen buraya ekleyebiliriz
    Category findBySlug(String slug);

    List<Category> findAllByOrderByOrderIndexAsc();

}
