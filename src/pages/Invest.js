import React, { useState, useEffect } from 'react';
import TradeModal from '../components/TradeModal';
import { getMarketData } from '../services/marketService';
import '../styles/dashboard.css';

const Invest = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [marketOpportunities, setMarketOpportunities] = useState([]);

    const portfolioStats = [
        { title: "Toplam Varlık Değeri", value: "₺1.240.500", trend: "+₺45.200 (Günlük)", isPositive: true },
        { title: "Kasa: Fiziksel Altın", value: "85 Gram", subtitle: "(Sigortalı Kasada Bekleyen)", isPositive: true },
        { title: "Kasa: Döviz ve Fon", value: "$4.500", subtitle: "(Küresel Yabancı Fon)", isPositive: true }
    ];

    const activeInvestments = [
        { name: "AURUM Dijital Altın Fonu", amount: "₺850.000", returnRate: "+%8.5" },
        { name: "Uluslararası Pırlanta Endeksi", amount: "₺250.000", returnRate: "+%12.4" },
        { name: "24 Ayar Külçe Zımmet", amount: "₺140.500", returnRate: "-%1.2" }
    ];

    // Sayfa yüklendiğinde Borsa API'sini çekip tavsiyeyi canlı rakamlara göre şekillendiren Yapay Zeka Mantığı
    useEffect(() => {
        const analyzeMarket = async () => {
            const data = await getMarketData();
            let ops = [];

            // Gram Altın analizi
            const gramRow = data.find(item => item.symbol.includes("GRAM"));
            if (gramRow) {
                if (gramRow.trend === 'down') {
                    ops.push({
                        title: `Gram Altın Fırsatı (${gramRow.price})`,
                        desc: "Yapay zeka analizine göre Gram Altın tarihi destek seviyesine indi. Bu büyük bir DİPTEN ALIM fırsatıdır.",
                        action: "Kademeli Alış Yap",
                        color: "#4caf50"
                    });
                } else {
                    ops.push({
                        title: `Gram Altın Trendi (${gramRow.price})`,
                        desc: "Gram Altın istikrarlı yükselişini sürdürüyor. Kâr satışı için uygun veya kilitli kasada tutmaya devam edilebilir.",
                        action: "Pozisyonu Koru",
                        color: "#ffd700"
                    });
                }
            }

            // Döviz (Euro) analizi
            const eurRow = data.find(item => item.symbol.includes("EUR"));
            if (eurRow) {
                if (eurRow.trend === 'down') {
                    ops.push({
                        title: `Euro Düşüşte (${eurRow.price})`,
                        desc: "Bölgesel veriler Euro'da gerilemeyi tetikledi. Sepet riskini azaltmak için bir miktar döviz biriktirme şansı.",
                        action: "Fon Sepetine Ekle",
                        color: "#4caf50"
                    });
                } else {
                    ops.push({
                        title: `Euro Yükselişte (${eurRow.price})`,
                        desc: "Döviz direnç kırılımı gerçekleştirdi. Mevcut yabancı para fonlarının getirileri anlık artış gösteriyor.",
                        action: "İncele",
                        color: "#ffd700"
                    });
                }
            }

            // Yüklenirken veya API hatası olursa varsayılan yedek
            if (ops.length === 0) {
                ops = [{ title: "Sistem Analizi", desc: "Piyasalar değerlendiriliyor. Lütfen bekleyin.", action: "Hesaplanıyor", color: "#a1a1aa" }];
            }

            setMarketOpportunities(ops);
        };

        analyzeMarket();
    }, []);

    return (
        <div className="invest-container">
            <div className="invest-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid rgba(255,215,0,0.2)', paddingBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '3rem' }}>Yatırım ve Özel Portföy</h2>
                    <p style={{ margin: '10px 0 0 0', color: '#a1a1aa' }}>VIP Müşteri: Hoşgeldiniz, varlıklarınızı yönetin ve yeni fırsatları keşfedin.</p>
                </div>
                <button 
                    className="primary-btn" 
                    onClick={() => setTradeOpen(true)}
                    style={{ fontSize: '1.2rem', padding: '18px 45px', boxShadow: '0 0 30px rgba(255,215,0,0.3)', animation: 'pulse 2s infinite' }}
                >
                    Hızlı İşlem Yap (Al/Sat)
                </button>
            </div>

            {/* Müşteri Portföy KPI Kartları */}
            <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '50px' }}>
                {portfolioStats.map((stat, i) => (
                    <div key={i} style={{ background: 'linear-gradient(135deg, rgba(30,30,40,0.8), rgba(15,15,20,0.9))', padding: '30px', borderRadius: '16px', borderTop: '2px solid #ffd700', boxShadow: '0 15px 30px rgba(0,0,0,0.6)' }}>
                        <div style={{ color: '#a1a1aa', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{stat.title}</div>
                        <div style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>{stat.value}</div>
                        <div style={{ color: stat.isPositive ? '#4caf50' : '#a1a1aa', marginTop: '10px', fontSize: '0.95rem' }}>{stat.trend || stat.subtitle}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                
                {/* Sol Panel: Aktif Yatırımlar Tablosu */}
                <div className="dashboard-card" style={{ background: 'rgba(15,15,20,0.95)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 215, 0, 0.2)', paddingBottom: '15px', marginBottom: '25px' }}>
                        <h3 style={{ margin: 0, color: '#ffd700' }}>Aktif Varlıklarım</h3>
                    </div>
                    <table style={{ width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>Yatırım Aracı</th>
                                <th>Güncel Değer</th>
                                <th>Getiri</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeInvestments.map((inv, idx) => (
                                <tr key={idx}>
                                    <td style={{ color: '#fff', fontSize: '1.1rem' }}>{inv.name}</td>
                                    <td style={{ fontFamily: 'Cinzel', color: '#ffd700', fontSize: '1.2rem' }}>{inv.amount}</td>
                                    <td>
                                        <span style={{ color: inv.returnRate.includes('+') ? '#4caf50' : '#ff4d4d', fontWeight: 'bold', background: inv.returnRate.includes('+') ? 'rgba(76,175,80,0.1)' : 'rgba(255,77,77,0.1)', padding: '5px 12px', borderRadius: '8px'}}>
                                            {inv.returnRate}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sağ Panel: Uzman Tavsiyeleri ve Fırsatlar */}
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(0,0,0,0.8))', border: '1px dashed rgba(255,215,0,0.4)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#ffd700' }}>Canlı Algoritma Önerileri</h3>
                    <p style={{ fontSize: '0.95rem', color: '#a1a1aa', marginBottom: '30px' }}>Piyasanın TAM ŞU ANKİ akışına göre oluşturulan zeka raporu.</p>
                    
                    {marketOpportunities.map((opp, idx) => (
                        <div key={idx} style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: `3px solid ${opp.color}` }}>
                            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>{opp.title}</div>
                            <div style={{ color: '#8892b0', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>{opp.desc}</div>
                            <button style={{ background: 'transparent', border: `1px solid ${opp.color}`, color: opp.color, fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s' }} 
                                    onMouseOver={e => { e.target.style.background = opp.color; e.target.style.color = '#000'; }}
                                    onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = opp.color; }}>
                                {opp.action}
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            <TradeModal isOpen={isTradeOpen} onClose={() => setTradeOpen(false)} />
        </div>
    );
};

export default Invest;
