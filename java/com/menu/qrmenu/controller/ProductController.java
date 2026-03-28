package com.menu.qrmenu.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.menu.qrmenu.entity.Product;
import com.menu.qrmenu.service.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file) throws Exception {

        // src/main/resources yerine dış dizinde 'uploads' klasörü
        String path = "uploads/";
        File folder = new File(path);

        if (!folder.exists()) {
            folder.mkdirs();
        }

        // Dosya isminin benzersiz olması için başına zaman damgası ekliyoruz
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Files.write(Paths.get(path + fileName), file.getBytes());

        return fileName;
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product newDetails) {
        // Burada 'repository' yerine 'productService' kullanıyoruz
        return productService.updateProduct(id, newDetails);
    }

}
