import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const AdminTerminal = () => {
    const [stats, setStats] = useState([
        { title: "Toplam Nakit Kasa Değeri", value: "Yükleniyor...", icon: "💰", color: "#ffd700" },
        { title: "Varlık Çeşitliliği", value: "Yükleniyor...", icon: "⚖️", color: "#ff4d4d" },
        { title: "Toplam İşlem Hacmi", value: "Yükleniyor...", icon: "📈", color: "#4caf50" }
    ]);
    const [inventoryData, setInventoryData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [portRes, transRes] = await Promise.all([
                    fetch('http://localhost:5000/api/portfolio/1'),
                    fetch('http://localhost:5000/api/transactions/1')
                ]);

                if (portRes.ok && transRes.ok) {
                    const portData = await portRes.json();
                    const transData = await transRes.json();

                    // Calculate total volume from transactions
                    const totalVolume = transData.reduce((sum, t) => sum + t.total_cost, 0);

                    setStats([
                        { title: "Toplam Nakit Kasa Değeri", value: `₺${portData.balance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`, icon: "💰", color: "#ffd700" },
                        { title: "Varlık Çeşitliliği", value: `${Object.keys(portData.assets).length} Farklı Varlık`, icon: "⚖️", color: "#ff4d4d" },
                        { title: "Toplam İşlem Hacmi", value: `₺${totalVolume.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`, icon: "📈", color: "#4caf50" }
                    ]);

                    // Map portfolio to inventory table
                    const inv = Object.entries(portData.assets).map(([symbol, data], index) => ({
                        id: `AST-${index + 100}`,
                        name: `${symbol} Varlığı`,
                        qty: data.amount,
                        value: data.avgPrice > 0 ? `Ort: ₺${data.avgPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}` : '-'
                    }));
                    setInventoryData(inv);

                    // Map transactions to right table
                    setTransactions(transData.slice(0, 10)); // Son 10 işlem
                }
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            }
        };

        fetchAdminData();
    }, []);

    return (
        <div className="admin-container">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                <div>
                    <h2>MERKEZ YÖNETİM & İŞLEM TERMİNALİ</h2>
                    <p style={{ margin: 0 }}>Tüm portföy envanteri ve geçmiş işlemlerin canlı takip ekranı.</p>
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
                                <th>Varlık Tipi</th>
                                <th>Adet</th>
                                <th>Ortalama Maliyet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryData.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center', color: '#a1a1aa'}}>Envanter boş.</td></tr>}
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

                {/* Sağ Tablo - Geçmiş İşlemler */}
                <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, rgba(15,15,20,0.9), rgba(25,25,35,0.8))' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255, 215, 0, 0.2)', paddingBottom: '15px', marginBottom: '25px' }}>
                        <h3 style={{ margin: 0, color: '#ffd700' }}>Son İşlem Kayıtları</h3>
                        <span style={{ background: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>Canlı</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>İşlem ID</th>
                                <th>Varlık</th>
                                <th>Tip</th>
                                <th>Tutar (TRY)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 && <tr><td colSpan="4" style={{textAlign: 'center', color: '#a1a1aa'}}>Henüz işlem yapılmadı.</td></tr>}
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td style={{ color: '#ffd700', fontWeight: 'bold' }}>TXN-{t.id}</td>
                                    <td>{t.asset_symbol} ({t.amount})</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            background: t.type === 'BUY' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                                            color: t.type === 'BUY' ? '#4caf50' : '#ff4d4d'
                                        }}>
                                            {t.type === 'BUY' ? 'ALIŞ' : 'SATIŞ'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right', fontFamily: 'Cinzel' }}>₺{t.total_cost.toLocaleString('tr-TR', {minimumFractionDigits: 2})}</td>
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
