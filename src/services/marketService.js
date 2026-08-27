export const getMarketData = async () => {
    try {
        // Production: Railway backend URL
        // Local: localhost:5000
        const isProduction = window.location.hostname !== 'localhost';
        const baseUrl = isProduction 
            ? 'https://kuyumcu-backend.railway.app'  // ⬅️ Railway'den aldığın URL buraya koy
            : 'http://localhost:5000';
        
        const targetUrl = `${baseUrl}/api/market`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        return Array.isArray(data) ? data : [];
        
    } catch (error) {
        console.error("Backend bağlantı hatası:", error);
        return [{ symbol: "Hata", price: "Bağlantı Kuruluyor...", trend: "down" }];
    }
};
