# 🌟 AURUM X - Lüks Kuyumcu & Finansal Varlık Yönetim Terminali

**Canlı Demo Linki:** [Proje Sayfasına Git - Canlı Versiyon 🚀](https://ustunkayaeylul72.github.io/kuyumcu_proje/index.html)

---

## 📖 Proje Hakkında
**AURUM X**, dünya standartlarındaki üst düzey lüks mücevher alışverişini, anlık borsa takibini ve uluslararası pırlanta/gümrük işlemlerini tek bir profesyonel panelde (Dashboard) birleştiren kapsamlı bir **Finansal React Projesidir**. 

Projede, modern İsviçre bankacılık sistemlerinden ilham alınarak **"Cam Tasarım (Glassmorphism)"** mimarisi uygulanmış ve arayüz tamamen lüks tipografi (Cinzel ve Outfit fontları) elementleriyle bezenmiştir.

---

## ✨ Teknik ve Mimari Özellikler

1. ⚡ **Canlı Gerçek Zamanlı Veri (Live Market API)** 
   Türkiye içi altın ve global döviz fiyatları, anlık olarak `finans.truncgil.com` sunucularından CORS yapısını atlayan akıllı bir Fetch mimarisi ile projeye dahil edilmektedir. Sunucu verisi anlık oklar ve trend renkleriyle görselleştirilir.
2. 🧮 **Dinamik Fiyatlandırma Algoritması (Auto-Math)** 
   22 Ayar 10 Gramlık Burma Bilezik'in vitrin fiyatı durağan değildir. Sistem; canlı piyasadaki "Saf Gram" verisini anlık arındırır ve matematiksel bir kodla `= (Gram Fiyatı * 10 * 0.916 Saflık Oranı)` güncelleyerek her saniye tamamen **gerçek fiyat** üzerinden vitrine yansıtır.
3. 🤖 **Gelişmiş AI Tavsiye Sistemi (Invest UI)** 
   Yatırım sekmesindeki analiz algoritması statik bir metin değildir. O anki canlı borsa verisini okuyarak piyasa artışta (yeşil) ise ayrı, düşüşte (kırmızı) ise ayrı yatırım uyarı senaryolarına (metin ve buton yönlendirmesi) bürünür.
4. 🏦 **Premium Yönetim Terminali**
   Projenin Admin arayüzü, gelişmiş kurumsal tablo altyapıları ile donatılmıştır. Canlı stok hacimleri ve uluslararası menşei taşıyan ürünlerin "Geçiş Hattı Renkleri (Gümrük)" gerçek bankacılık arayüzlerini anımsatacak şekilde modellenmiştir.

---

## 🛠️ Kullanılan Teknolojiler
* **Frontend:** `React.js` (v18.2.0 - State Yönetimi & Bileşen Çatısı)
* **Tasarım Dili:** Özel `Vanilla CSS` (Glassmorphism, Global Layout Zoom `%70`, Pulse Hover Animasyonları)
* **Bağımlılık (Paket) Yönetimi:** `npm`
* **Deploy (Host):** `gh-pages` (Sunucusuz Sürekli Dağıtım)
* **Veri Tüketimi:** Gelişmiş ES6 Fetch API & Asenkron Çözümleyici

---

## 🚀 Projeyi Bilgisayarınızda Çalıştırmak (Kurulum)

Eğer projeyi kendi kod editörünüzde incelemek veya üstüne geliştirme yapmak isterseniz:

```bash
# 1. Projeyi bilgisayarınıza klonlayın
git clone https://github.com/ustunkayaeylul72/kuyumcu_proje.git

# 2. Projenin bulunduğu klasöre geçiş yapın
cd kuyumcu_proje

# 3. İhtiyaç duyulan tüm React kütüphanelerini saniyeler içinde kurun
npm install

# 4. Projeyi yerel tarayıcınızda başlatın!
npm start
```

*Not: "npm start" dedikten sonra proje varsayılan olarak `http://localhost:3000` adresinde hayat bulacaktır.*

---

**Geliştirici & Tasarımcı:** Eylul Ustunkaya  
**Sürüm:** V2.0 Premium Build 
