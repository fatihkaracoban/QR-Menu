package com.menu.qrmenu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.menu.qrmenu.entity.Category;
import com.menu.qrmenu.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // TÜM KATEGORİLERİ GETİR
    @GetMapping
    public List<Category> listCategories() {
        return categoryService.getAllCategories();
    }

    // YENİ KATEGORİ EKLE
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    // KATEGORİ GÜNCELLE
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    // KATEGORİ SİL
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }

    // DRAG-DROP SIRALAMA GÜNCELLEME
    @PutMapping("/update-order")
    public void updateOrder(@RequestBody List<Category> categories) {
        categoryService.updateOrder(categories);
    }

}
