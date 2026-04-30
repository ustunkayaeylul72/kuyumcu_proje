import React, { useState, useEffect } from 'react';
import TradeModal from '../components/TradeModal';
import { getMarketData } from '../services/marketService';
import '../styles/dashboard.css';

const Invest = () => {
    const [isTradeOpen, setTradeOpen] = useState(false);
    const [tradeAsset, setTradeAsset] = useState("GRAM");
    const [marketOpportunities, setMarketOpportunities] = useState([]);
    const [portfolioData, setPortfolioData] = useState({ balance: 0, assets: {} });

    // Fetch portfolio data from backend
    const fetchPortfolio = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/portfolio/1');
            if (response.ok) {
                const data = await response.json();
                setPortfolioData(data);
            }
        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, [isTradeOpen]); // Refresh when trade modal closes

    const openTradeWithAsset = (assetSymbol) => {
        setTradeAsset(assetSymbol);
        setTradeOpen(true);
    };

    const portfolioStats = [
        { title: "Nakit Bakiye (TRY)", value: `₺${portfolioData.balance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`, trend: "Kullanılabilir Bakiye", isPositive: true },
        { 
            title: "Kasa: Fiziksel Altın", 
            value: `${portfolioData.assets['GRAM']?.amount || 0} Gr / ${portfolioData.assets['ÇEYREK']?.amount || 0} Çyrk`, 
            subtitle: "(Sigortalı Kasada Bekleyen)", 
            isPositive: true 
        },
        { 
            title: "Kasa: Yabancı Döviz", 
            value: `$${portfolioData.assets['USD']?.amount || 0} / €${portfolioData.assets['EUR']?.amount || 0}`, 
            subtitle: "(Küresel Döviz Hesabı)", 
            isPositive: true 
        }
    ];

    const activeInvestments = Object.entries(portfolioData.assets).map(([symbol, data]) => ({
        name: `${symbol} Varlığı`,
        amount: `${data.amount} Birim`,
        returnRate: `${parseFloat(data.roi) >= 0 ? '+' : ''}%${data.roi}`
    }));

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
                        color: "#4caf50",
                        symbol: "GRAM"
                    });
                } else {
                    ops.push({
                        title: `Gram Altın Trendi (${gramRow.price})`,
                        desc: "Gram Altın istikrarlı yükselişini sürdürüyor. Kâr satışı için uygun veya kilitli kasada tutmaya devam edilebilir.",
                        action: "Satış / İşlem Yap",
                        color: "#ffd700",
                        symbol: "GRAM"
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
                        color: "#4caf50",
                        symbol: "EUR"
                    });
                } else {
                    ops.push({
                        title: `Euro Yükselişte (${eurRow.price})`,
                        desc: "Döviz direnç kırılımı gerçekleştirdi. Mevcut yabancı para fonlarının getirileri anlık artış gösteriyor.",
                        action: "İncele / İşlem Yap",
                        color: "#ffd700",
                        symbol: "EUR"
                    });
                }
            }

            // Yüklenirken veya API hatası olursa varsayılan yedek
            if (ops.length === 0) {
                ops = [{ title: "Sistem Analizi", desc: "Piyasalar değerlendiriliyor. Lütfen bekleyin.", action: "Hesaplanıyor", color: "#a1a1aa", symbol: "GRAM" }];
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
                    onClick={() => openTradeWithAsset("GRAM")}
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
                                <th>Miktar</th>
                                <th>Getiri (ROI)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeInvestments.length === 0 && (
                                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#a1a1aa'}}>Henüz varlığınız bulunmamaktadır.</td></tr>
                            )}
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
                            <button 
                                style={{ background: 'transparent', border: `1px solid ${opp.color}`, color: opp.color, fontWeight: 'bold', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s' }} 
                                onMouseOver={e => { e.target.style.background = opp.color; e.target.style.color = '#000'; }}
                                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = opp.color; }}
                                onClick={() => openTradeWithAsset(opp.symbol)}
                            >
                                {opp.action}
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            <TradeModal isOpen={isTradeOpen} onClose={() => setTradeOpen(false)} defaultAsset={tradeAsset} />
        </div>
    );
};

export default Invest;

