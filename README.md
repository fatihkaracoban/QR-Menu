# 📱 Dinamik QR Menü ve Yönetim Sistemi

Bu proje, yerel işletmelerin (kafe, pastane, restoran) ürünlerini dijital ortamda sergileyebilmesi ve yönetebilmesi için geliştirilmiş, tam kapsamlı ve dinamik bir QR Menü uygulamasıdır.

Müşteriler, masalarındaki QR kodu okutarak güncel menüye ve ürün detaylarına kolayca ulaşabilirken; işletme sahipleri güvenli admin paneli üzerinden anlık olarak ürün, fiyat ve kategori güncellemeleri yapabilir.

## 🚀 Özellikler

- **Müşteri Arayüzü (Frontend):** Mobil uyumlu (Responsive), hızlı ve kullanıcı dostu kategori/ürün listeleme.
- **Admin Paneli:** Ürün ekleme, silme, fiyat güncelleme ve görsel yükleme işlemleri.
- **Dinamik Kategori Sistemi:** Ürünleri kategorilere ayırarak filtreleme kolaylığı.
- **Güvenli Giriş (Authentication):** Spring Security ile korunan ve sadece yetkili kişilerin erişebildiği yönetim arayüzü.
- **Dosya Yönetimi:** Yüklenen ürün fotoğraflarının sunucuda güvenle saklanması ve sunulması.

## 🛠️ Kullanılan Teknolojiler

- **Backend:** Java, Spring Boot, Spring Security
- **Frontend:** HTML5, CSS3, Bootstrap 5, Thymeleaf (Server-side rendering)
- **Veritabanı:** H2 Database (Geliştirme ortamı için)
- **Mimari:** MVC (Model-View-Controller)

## ⚙️ Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. Projeyi bilgisayarınıza klonlayın:
   ```bash
   git clone [https://github.com/KULLANICI_ADIN/qr-menu-sistemi.git](https://github.com/KULLANICI_ADIN/qr-menu-sistemi.git)

2. Proje dizinine gidin:
   ```bash
   cd qr-menu-sistemi

3. Maven kullanarak projeyi derleyin ve çalıştırın:
   ```bash
   mvn spring-boot:run

4. Tarayıcınızda uygulamayı görüntüleyin:

Müşteri Ekranı: http://localhost:8080

Admin Paneli: http://localhost:8080/login

Not: Varsayılan admin giriş bilgileri proje test aşamasında olduğu için application.properties veya SecurityConfig dosyası içerisinde belirlenmiştir.

