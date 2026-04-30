export const getMarketData = async () => {
    try {
        // Backend API'ye istek atıyoruz (Backend Tunçgil'den çekecek)
        const targetUrl = `http://localhost:5000/api/market`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Backend zaten formatlanmış veriyi gönderiyor
        return Array.isArray(data) ? data : [];
        
    } catch (error) {
        console.error("Backend bağlantı hatası:", error);
        return [{ symbol: "Hata", price: "Bağlantı Kuruluyor...", trend: "down" }];
    }
};
