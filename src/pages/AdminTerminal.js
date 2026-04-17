import React from 'react';
import '../styles/dashboard.css';

const AdminTerminal = () => {
    // Örnek sahte (mock) veriler ile yapıyı zenginleştiriyoruz
    const stats = [
        { title: "Toplam Kasa Değeri", value: "₺28.450.000,00", icon: "💰", color: "#ffd700" },
        { title: "Gümrükteki Riskli Ürün", value: "3 Adet", icon: "⚖️", color: "#ff4d4d" },
        { title: "Günlük İşlem Hacmi", value: "₺1.250.400,00", icon: "📈", color: "#4caf50" }
    ];

    const inventoryData = [
        { id: "INV-001", name: "22 Ayar Burma Bilezik", qty: 45, value: "₺2.925.000" },
        { id: "INV-002", name: "Pırlanta Tektaş (1 Karat)", qty: 12, value: "₺1.020.000" },
        { id: "INV-003", name: "Külçe Altın (1 kg)", qty: 5, value: "₺11.500.000" },
    ];

    const customsData = [
        { id: "CST-991", origin: "Dubai, BAE", type: "İşlenmemiş Altın", status: "Kırmızı Hat", risk: "Yüksek" },
        { id: "CST-992", origin: "Antwerp, Belçika", type: "İşlenmiş Pırlanta", status: "Yeşil Hat", risk: "Düşük" },
        { id: "CST-993", origin: "Zürih, İsviçre", type: "Sertifikalı Külçe", status: "Sarı Hat", risk: "Orta" },
    ];

    return (
        <div className="admin-container">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h2>MERKEZ YÖNETİM & GÜMRÜK TERMİNALİ</h2>
                    <p style={{ margin: 0 }}>Tüm şube envanteri ve uluslararası gümrük süreçlerinin canlı takip ekranı.</p>
                </div>
                <div style={{ padding: '15px 30px', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid #ffd700', borderRadius: '12px', color: '#ffd700', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    SİSTEM DURUMU: AKTİF
                </div>
            </div>

            {/* Üst Bilgi Kartları */}
            <div className="admin-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '60px' }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{ background: 'rgba(20,20,30, 0.8)', padding: '30px', borderRadius: '16px', borderLeft: `4px solid ${stat.color}`, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{stat.icon}</div>
                        <div style={{ color: '#a1a1aa', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{stat.title}</div>
                        <div style={{ color: stat.color, fontSize: '2.2rem', fontFamily: 'Cinzel, serif', fontWeight: 'bold' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Sol Tablo - Envanter */}
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(15,15,20,0.9), rgba(25,25,35,0.8))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255, 215, 0, 0.2)', paddingBottom: '15px', marginBottom: '25px' }}>
                        <h3 style={{ margin: 0, color: '#ffd700' }}>Canlı Merkez Envanteri</h3>
                        <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Güncel</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Kod</th>
                                <th>Ürün Adı</th>
                                <th>Adet</th>
                                <th>Toplam Değer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.map(item => (
                                <tr key={item.id}>
                                    <td style={{ color: '#ffd700', fontWeight: 'bold' }}>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                    <td style={{ textAlign: 'right', fontFamily: 'Cinzel' }}>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sağ Tablo - Gümrük */}
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(15,15,20,0.9), rgba(25,25,35,0.8))' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255, 215, 0, 0.2)', paddingBottom: '15px', marginBottom: '25px' }}>
                        <h3 style={{ margin: 0, color: '#ffd700' }}>Uluslararası Ticaret & Gümrük</h3>
                        <span style={{ background: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Bekleyen İşlemler</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Kargo ID</th>
                                <th>Menşei</th>
                                <th>Durum (Hat)</th>
                                <th>Risk Seviyesi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customsData.map(cst => (
                                <tr key={cst.id}>
                                    <td style={{ color: '#ffd700', fontWeight: 'bold' }}>{cst.id}</td>
                                    <td>{cst.origin}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            background: cst.status.includes("Kırmızı") ? 'rgba(255,0,0,0.2)' : cst.status.includes("Yeşil") ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,0,0.2)',
                                            color: cst.status.includes("Kırmızı") ? '#ff4d4d' : cst.status.includes("Yeşil") ? '#4caf50' : '#ffd700'
                                        }}>
                                            {cst.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{cst.risk}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTerminal;
