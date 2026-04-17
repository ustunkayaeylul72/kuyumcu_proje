import React, { useEffect, useState } from 'react';
import LiveTicker from '../components/LiveTicker';
import AssetCard from '../components/AssetCard';
import { getMarketData } from '../services/marketService';

import pirlantaImg from '../assets/images/pirlanta.jpg';
import bilezikImg from '../assets/images/bilezik.jpg';
import gramImg from '../assets/images/gram.jpg';

const Home = () => {
    const [liveGramPrice, setLiveGramPrice] = useState("Hesaplanıyor...");
    const [liveBilezikPrice, setLiveBilezikPrice] = useState("Hesaplanıyor...");

    useEffect(() => {
        const fetchPrices = async () => {
            const data = await getMarketData();
            // Piyasadan Gram Altın fiyatını buluyoruz
            const gramData = data.find(item => item.symbol.includes("GRAM"));
            if (gramData) {
                // Gelen "7.004,62" gibi karmaşık Türkçe stringi tamamen güvenli saf bir matematiksel rakama (7004.62) çeviriyoruz:
                // 1. Önce virgül (,) haricindeki nokta gibi binlik ayraçları yok et
                // 2. Ardından sondaki virgülü standart ondalık noktaya (.) çevir
                const pureString = gramData.price.replace(/[^\d,]/g, '').replace(',', '.');
                const pureNumber = parseFloat(pureString);
                
                // Gram Sertifikası doğrudan API'den gelen görsel halini korusun
                setLiveGramPrice(gramData.price);
                
                if(!isNaN(pureNumber)) {
                    // Matematik: (Gram fiyatı * 10 Gram Hacim * 0.916 Saflık Oranı [22 ayar altının 24'e oranı]) + İşçilik
                    const bilezikHesap = (pureNumber * 10 * 0.916).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
                    setLiveBilezikPrice(bilezikHesap);
                } else {
                    setLiveBilezikPrice("Hesaplanamıyor");
                }
            }
        };
        fetchPrices();
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            <LiveTicker />
            
            <div className="hero-section" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <h1 className="hero-title" style={{ fontSize: '4.5rem', marginBottom: '20px', letterSpacing: '2px', textShadow: '0 5px 15px rgba(212, 175, 55, 0.4)' }}>
                    <span className="gold-text">AURUM</span> X Özel Koleksiyonu
                </h1>
                <p className="hero-subtitle" style={{ color: '#d1d5db', fontSize: '1.4rem', fontWeight: '500', maxWidth: '750px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
                    Geleneksel zanaat ile yenilikçi teknolojinin görkemli buluşmasına şahit olun.<br/>
                    Sadece size özel olarak hazırlanmış o en nadide mücevheri keşfedin.
                </p>
                
                <div className="catalog" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px' }}>
                    <AssetCard 
                        image={pirlantaImg} 
                        title="Pırlanta Tektaş Yüzük" 
                        type="Özel İşlemeli Mücevher" 
                        price="₺45.000,00" 
                    />
                    <AssetCard 
                        image={bilezikImg} 
                        title="22 Ayar Burma Bilezik" 
                        type="Geleneksel Mücevher (10 Gr)" 
                        price={liveBilezikPrice} 
                    />
                    <AssetCard 
                        image={gramImg} 
                        title="Gram Altın Sertifikası" 
                        type="Dijital & Fiziksel Varlık" 
                        price={liveGramPrice} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
