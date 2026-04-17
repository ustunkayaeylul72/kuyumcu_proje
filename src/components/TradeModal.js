import React, { useState } from 'react';

const TradeModal = ({ isOpen, onClose, defaultAsset = "GRAM" }) => {
    const [amount, setAmount] = useState('');
    
    if (!isOpen) return null;

    return (
        <div className="trade-modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h3>Anlık İşlem (Al/Sat)</h3>
                
                <div className="form-group">
                    <label>Varlık Seçimi</label>
                    <select defaultValue={defaultAsset} className="form-control">
                        <option value="GRAM">Gram Altın</option>
                        <option value="ONS">ONS Altın</option>
                        <option value="USD">Amerikan Doları</option>
                        <option value="BTC">Bitcoin</option>
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
                    />
                </div>
                
                <div className="modal-actions">
                    <button className="btn-buy" onClick={() => alert(`${amount} miktarında alış emri verildi.`)}>Alış Yap</button>
                    <button className="btn-sell" onClick={() => alert(`${amount} miktarında satış emri verildi.`)}>Satış Yap</button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
