import React, { useState, useEffect } from 'react';
import { getMarketData } from '../services/marketService';
import { executeTrade } from '../services/portfolioService';

const TradeModal = ({ isOpen, onClose, defaultAsset = "GRAM" }) => {
    const [amount, setAmount] = useState('');
    const [asset, setAsset] = useState(defaultAsset);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAsset(defaultAsset);
    }, [defaultAsset, isOpen]);
    
    if (!isOpen) return null;

    const handleTrade = async (type) => {
        if (!amount || amount <= 0) {
            alert('Lütfen geçerli bir miktar giriniz.');
            return;
        }

        setLoading(true);
        try {
            // Gerçek güncel fiyatı çekiyoruz
            const marketData = await getMarketData();
            
            // Seçili asset'in verisini bul (Örn: "GRAM" -> "GRAM Altın")
            const targetAsset = marketData.find(item => item.symbol.includes(asset));
            
            if (!targetAsset || !targetAsset.numericPrice) {
                alert('Bu varlık için güncel fiyat bilgisi alınamadı.');
                setLoading(false);
                return;
            }

            const price = targetAsset.numericPrice;

            // Arka plana istek yerine LocalStorage servisimize gönderiyoruz
            const data = await executeTrade(1, type, asset, parseFloat(amount), price);

            if (data.success) {
                const totalCost = price * parseFloat(amount);
                alert(`İşlem Başarılı!\n\nBirim Fiyat: ₺${price.toLocaleString('tr-TR', {minimumFractionDigits: 2})}\nToplam Tutar: ₺${totalCost.toLocaleString('tr-TR', {minimumFractionDigits: 2})}\n\nYeni Bakiye: ₺${data.newBalance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`);
                setAmount('');
                onClose();
            } else {
                alert(`İşlem Başarısız: ${data.error}`);
            }
        } catch (error) {
            alert('İşlem sırasında bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trade-modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose} disabled={loading}>&times;</button>
                <h3>Anlık İşlem (Al/Sat)</h3>
                
                <div className="form-group">
                    <label>Varlık Seçimi</label>
                    <select value={asset} onChange={(e) => setAsset(e.target.value)} className="form-control">
                        <option value="GRAM">Gram Altın</option>
                        <option value="ÇEYREK">Çeyrek Altın</option>
                        <option value="USD">Amerikan Doları</option>
                        <option value="EUR">Euro</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Miktar</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Miktar giriniz..." 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                </div>
                
                <div className="modal-actions">
                    <button className="btn-buy" onClick={() => handleTrade('BUY')} disabled={loading}>
                        {loading ? 'İşleniyor...' : 'Alış Yap'}
                    </button>
                    <button className="btn-sell" onClick={() => handleTrade('SELL')} disabled={loading}>
                        {loading ? 'İşleniyor...' : 'Satış Yap'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
