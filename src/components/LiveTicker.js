import React, { useEffect, useState } from 'react';
import { getMarketData } from '../services/marketService';

const LiveTicker = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getMarketData();
            setData(result);
        };
        fetchData();
        // Tunçgil kullandığımız için limit sınırımız yok, kullanıcının lüks ve anlık bir his yaşaması için
        // taramayı eski haline (tam 5 saniye / 5000ms hizasına) geri çektik. Veriler aşırı güncel akacak!
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const tickerItems = [...data, ...data, ...data, ...data];

    return (
        <div className="live-ticker-band">
            <div className="ticker-fade-left"></div>
            <div className="ticker-track">
                {tickerItems.map((item, index) => (
                    <div key={index} className="ticker-item">
                        <span className="ticker-symbol">{item.symbol}</span>
                        <span className="ticker-price">{item.price}</span>
                        <span className={`ticker-trend ${item.trend}`}>
                           {item.trend === 'up' ? '▲' : '▼'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="ticker-fade-right"></div>
        </div>
    );
};

export default LiveTicker;
