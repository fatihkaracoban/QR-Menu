package com.menu.qrmenu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.menu.qrmenu.entity.Product;
import com.menu.qrmenu.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product newDetails) {
        return productRepository.findById(id).map(p -> {
            p.setName(newDetails.getName());
            p.setPrice(newDetails.getPrice());
            p.setDescription(newDetails.getDescription());
            p.setCategory(newDetails.getCategory()); // Kategori eklendi
            if (newDetails.getImage() != null) {
                p.setImage(newDetails.getImage()); // Sadece yeni resim varsa güncelle
            }
            return productRepository.save(p);
        }).orElseThrow();
    }

}
