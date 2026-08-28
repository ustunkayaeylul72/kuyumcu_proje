export const getMarketData = async () => {
    try {
        const targetUrl = `https://finans.truncgil.com/v4/today.json?nocache=${new Date().getTime()}`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const selected = [
            { key: 'USD', label: 'USD', prefix: '₺' },
            { key: 'EUR', label: 'EUR', prefix: '₺' },
            { key: 'GBP', label: 'GBP', prefix: '₺' },
            { key: 'ONS', label: 'ONS', prefix: '$' },
            { key: 'GRA', label: 'GRAM', prefix: '₺' },
            { key: 'CEYREKALTIN', label: 'ÇEYREK', prefix: '₺' },
            { key: 'CUMHURIYETALTINI', label: 'CUMHURİYET', prefix: '₺' }
        ];

        const formattedData = selected.map(item => {
            const rawItem = data[item.key];
            if (!rawItem) return null;

            let trend = Number(rawItem.Change) < 0 ? 'down' : 'up';
            
            let rawPrice = Number(rawItem.Selling);
            const formattedString = rawPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const price = item.prefix === '$' ? `$${formattedString}` : `₺${formattedString}`;

            return {
                symbol: ['USD', 'EUR', 'GBP'].includes(item.label) ? `${item.label}/TRY` : 
                        item.label === 'ONS' ? 'ONS Altın' : 
                        item.label === 'GRAM' ? 'GRAM Altın' : item.label,
                price: price,
                trend: trend,
                numericPrice: rawPrice
            };
        }).filter(Boolean);

        return formattedData;
        
    } catch (error) {
        console.error("API bağlantı hatası:", error);
        return [{ symbol: "Hata", price: "Bağlantı Kuruluyor...", trend: "down" }];
    }
};
