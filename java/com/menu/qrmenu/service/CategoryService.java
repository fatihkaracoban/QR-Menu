package com.menu.qrmenu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.menu.qrmenu.entity.Category;
import com.menu.qrmenu.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // TÜM KATEGORİLERİ SIRALI GETİR
    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByOrderIndexAsc();
    }

    // KATEGORİ EKLE
    public Category saveCategory(Category category) {

        if (category.getOrderIndex() == null) {
            int size = categoryRepository.findAll().size();
            category.setOrderIndex(size);
        }

        return categoryRepository.save(category);
    }

    // KATEGORİ SİL
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // KATEGORİ GÜNCELLE
    public Category updateCategory(Long id, Category newDetails) {

        return categoryRepository.findById(id).map(c -> {

            c.setName(newDetails.getName());
            c.setSlug(newDetails.getSlug());

            if (newDetails.getImage() != null) {
                c.setImage(newDetails.getImage());
            }

            return categoryRepository.save(c);

        }).orElseThrow();
    }

    // DRAG-DROP SIRALAMA GÜNCELLE
    public void updateOrder(List<Category> categories) {

        for (Category c : categories) {

            Category cat = categoryRepository.findById(c.getId()).orElse(null);

            if (cat != null) {
                cat.setOrderIndex(c.getOrderIndex());
                categoryRepository.save(cat);
            }

        }

    }

}
