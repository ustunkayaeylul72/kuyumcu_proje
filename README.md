#  AURUM X - Lüks Kuyumcu & Finansal Varlık Yönetim Terminali

**Canlı Demo Linki:** [Proje Sayfasına Git - Canlı Versiyon](https://ustunkayaeylul72.github.io/kuyumcu_proje/index.html)

---

##  Proje Hakkında
**AURUM X**, anlık borsa takibini ve alım/satım işlemlerini tek bir profesyonel panelde (Dashboard) birleştiren kapsamlı bir **Finansal React Projesidir**. 

Projede, modern İsviçre bankacılık sistemlerinden ilham alınarak **"Cam Tasarım (Glassmorphism)"** mimarisi uygulanmış ve arayüz tamamen lüks tipografi (Cinzel ve Outfit fontları) elementleriyle bezenmiştir.

---

##  Teknik ve Mimari Özellikler

1.  **Canlı Gerçek Zamanlı Veri (Live Market API)** 
   Türkiye içi altın ve global döviz fiyatları, anlık olarak `finans.truncgil.com` sunucularından çekilip Node.js backend'imiz üzerinden işlenerek (CORS engelleri aşılarak) projeye dahil edilmektedir.
2.  **Dinamik Fiyatlandırma Algoritması (Auto-Math)** 
   22 Ayar 10 Gramlık Burma Bilezik'in vitrin fiyatı durağan değildir. Sistem; canlı piyasadaki "Saf Gram" verisini okuyarak matematiksel bir formülle `= (Gram Fiyatı * 10 * 0.916)` vitrine anlık yansıtır.
3.  **Gelişmiş AI Tavsiye Sistemi (Invest UI)** 
   Yatırım sekmesindeki analiz algoritması statik değildir. O anki canlı borsa verisini okuyarak piyasa artışta ise ayrı, düşüşte ise ayrı yatırım senaryoları ve uyarıları üretir.
4.  **B2B2C Hibrit Sistem (Müşteri & Yönetici Rolleri)**
   Sistem sadece tek taraflı değildir. **Vitrin ve Yatırım** sayfaları VIP müşterilerin kendi portföylerini yönetip canlı işlem (Trade) yaptığı kısımdır. **Admin Terminali** ise kuyumcu/şirket yöneticisinin tüm müşterilerin varlıklarını ve son alım-satım işlemlerini canlı takip ettiği merkez paneldir.
5.  **Tam Teşekküllü Backend & Veritabanı (Node.js & SQLite)**
   Uygulamanın arkaplanında Express.js tabanlı özel bir API servisi çalışmaktadır. Tüm işlemler anlık olarak yerel **SQLite** veritabanında tutulur. Kullanılan veri tabloları şunlardır:
   - `users`: Kullanıcıların nakit bakiyelerini (balance) tutar.
   - `portfolio`: Kullanıcının sahip olduğu varlıkları (GRAM, EUR, ÇEYREK vb.) ve miktarlarını depolar.
   - `transactions`: Yapılan tüm Alış (BUY) ve Satış (SELL) işlemlerinin kaydını (Zaman, Fiyat, Tutar) loglar ve gerçek ROI (Getiri Oranı) hesaplamasında kullanılır.

---

##  Kullanılan Teknolojiler
* **Frontend:** `React.js` (v18.2.0 - State Yönetimi & Bileşen Çatısı)
* **Tasarım Dili:** Özel `Vanilla CSS` (Glassmorphism, Global Layout Zoom `%70`, Pulse Hover Animasyonları)
* **Bağımlılık (Paket) Yönetimi:** `npm`
* **Deploy (Host):** `gh-pages` (Sunucusuz Sürekli Dağıtım)
* **Veri Tüketimi:** Gelişmiş ES6 Fetch API & Asenkron Çözümleyici

---

##  Projeyi Bilgisayarınızda Çalıştırmak (Kurulum)

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

##SİTEDEN BAZI GÖRSELLER

<img width="1913" height="875" alt="image" src="https://github.com/user-attachments/assets/15245d80-c709-4b74-904c-e5f48f962541" />


<img width="1890" height="861" alt="image" src="https://github.com/user-attachments/assets/a88de9d8-e902-4a8a-85e3-acbc96885925" />


<img width="1885" height="837" alt="image" src="https://github.com/user-attachments/assets/c6d77933-12b5-4567-b62f-20951575a47e" />




---

**Geliştirici & Tasarımcı:** Eylul Ustunkaya  
**Sürüm:** V2.0 Premium Build 
