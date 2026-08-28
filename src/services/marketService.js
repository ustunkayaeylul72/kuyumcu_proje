export const getMarketData = async () => {
    try {
        const targetUrl = `https://finans.truncgil.com/today.json?nocache=${new Date().getTime()}`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const selected = [
            { key: 'USD', label: 'USD', prefix: '₺' },
            { key: 'EUR', label: 'EUR', prefix: '₺' },
            { key: 'GBP', label: 'GBP', prefix: '₺' },
            { key: 'ons', label: 'ONS', prefix: '$' },
            { key: 'gram-altin', label: 'GRAM', prefix: '₺' },
            { key: 'ceyrek-altin', label: 'ÇEYREK', prefix: '₺' },
            { key: 'cumhuriyet-altini', label: 'CUMHURİYET', prefix: '₺' }
        ];

        const formattedData = selected.map(item => {
            const rawItem = data[item.key];
            if (!rawItem) return null;

            let trend = String(rawItem['Değişim']).includes('-') ? 'down' : 'up';
            
            if (item.key === 'EUR' || item.key === 'ceyrek-altin') {
                trend = 'down';
            }
            
            let rawPrice = String(rawItem['Satış']);
            const price = rawPrice.startsWith('$') ? rawPrice : `${item.prefix}${rawPrice}`;

            let numericPrice = rawPrice.replace('.', '');
            numericPrice = numericPrice.replace(',', '.');
            
            return {
                symbol: ['USD', 'EUR', 'GBP'].includes(item.label) ? `${item.label}/TRY` : 
                        item.label === 'ONS' ? 'ONS Altın' : 
                        item.label === 'GRAM' ? 'GRAM Altın' : item.label,
                price: price,
                trend: trend,
                numericPrice: parseFloat(numericPrice)
            };
        }).filter(Boolean);

        return formattedData;
        
    } catch (error) {
        console.error("API bağlantı hatası:", error);
        return [{ symbol: "Hata", price: "Bağlantı Kuruluyor...", trend: "down" }];
    }
};
