const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database');

// Helper function to get market data
const fetchMarketData = async () => {
    const targetUrl = `https://finans.truncgil.com/today.json?nocache=${new Date().getTime()}`;
    const response = await axios.get(targetUrl);
    const data = response.data;
    
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

        // Parse numeric price for calculations
        let numericPrice = rawPrice.replace('.', ''); // remove thousands separator
        numericPrice = numericPrice.replace(',', '.'); // replace decimal comma with dot
        
        return {
            symbol: item.label,
            price: price,
            trend: trend,
            numericPrice: parseFloat(numericPrice)
        };
    }).filter(Boolean);

    return formattedData;
};

// Market verilerini Tunçgil'den çek
router.get('/market', async (req, res) => {
    try {
        const formattedData = await fetchMarketData();
        // Modify symbols to match previous frontend expectations for the market page if needed, but they are generally okay.
        // The frontend expects USD/TRY etc., let's append /TRY where needed for UI.
        const uiData = formattedData.map(item => ({
            ...item,
            symbol: ['USD', 'EUR', 'GBP'].includes(item.symbol) ? `${item.symbol}/TRY` : 
                    item.symbol === 'ONS' ? 'ONS Altın' : 
                    item.symbol === 'GRAM' ? 'GRAM Altın' : item.symbol
        }));
        res.json(uiData);
    } catch (error) {
        console.error("Market data error:", error.message);
        res.status(500).json({ error: "Could not fetch market data" });
    }
});

// Portföy ve Bakiye Getir (ROI hesaplaması ile birlikte)
router.get('/portfolio/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const marketData = await fetchMarketData();
        const marketPrices = {};
        marketData.forEach(item => {
            marketPrices[item.symbol] = item.numericPrice;
        });

        db.get("SELECT balance FROM users WHERE id = ?", [userId], (err, userRow) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!userRow) return res.status(404).json({ error: "User not found" });

            db.all("SELECT asset_symbol, amount FROM portfolio WHERE user_id = ?", [userId], (err, portfolioRows) => {
                if (err) return res.status(500).json({ error: err.message });
                
                db.all("SELECT asset_symbol, amount, price, type FROM transactions WHERE user_id = ? AND type = 'BUY'", [userId], (err, transactionRows) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const assetsData = {};
                    
                    portfolioRows.forEach(row => {
                        const symbol = row.asset_symbol;
                        const currentAmount = row.amount;
                        
                        // Ortalama maliyet hesabı
                        let totalCost = 0;
                        let totalBoughtAmount = 0;
                        
                        transactionRows.forEach(tx => {
                            if (tx.asset_symbol === symbol) {
                                totalCost += (tx.price * tx.amount);
                                totalBoughtAmount += tx.amount;
                            }
                        });

                        let avgPrice = 0;
                        let roi = 0;

                        if (totalBoughtAmount > 0) {
                            avgPrice = totalCost / totalBoughtAmount;
                            const currentPrice = marketPrices[symbol] || avgPrice; // fallback to avgPrice if not found
                            roi = ((currentPrice - avgPrice) / avgPrice) * 100;
                        }

                        assetsData[symbol] = {
                            amount: currentAmount,
                            avgPrice: avgPrice,
                            roi: roi.toFixed(2)
                        };
                    });

                    res.json({
                        balance: userRow.balance,
                        assets: assetsData
                    });
                });
            });
        });
    } catch (error) {
        console.error("Portfolio error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Alım-Satım İşlemi (Trade)
router.post('/trade', (req, res) => {
    const { userId, type, assetSymbol, amount, price } = req.body;
    
    // type: 'BUY' or 'SELL'
    const totalCost = amount * price;

    db.get("SELECT balance FROM users WHERE id = ?", [userId], (err, userRow) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!userRow) return res.status(404).json({ error: "User not found" });

        db.get("SELECT amount FROM portfolio WHERE user_id = ? AND asset_symbol = ?", [userId, assetSymbol], (err, portfolioRow) => {
            if (err) return res.status(500).json({ error: err.message });

            const currentAssetAmount = portfolioRow ? portfolioRow.amount : 0;
            let newBalance = userRow.balance;
            let newAssetAmount = currentAssetAmount;

            if (type === 'BUY') {
                if (newBalance < totalCost) {
                    return res.status(400).json({ error: "Yetersiz Bakiye" });
                }
                newBalance -= totalCost;
                newAssetAmount += amount;
            } else if (type === 'SELL') {
                if (currentAssetAmount < amount) {
                    return res.status(400).json({ error: "Yetersiz Varlık Miktarı" });
                }
                newBalance += totalCost;
                newAssetAmount -= amount;
            } else {
                return res.status(400).json({ error: "Geçersiz işlem tipi" });
            }

            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                
                db.run("UPDATE users SET balance = ? WHERE id = ?", [newBalance, userId]);
                
                if (portfolioRow) {
                    db.run("UPDATE portfolio SET amount = ? WHERE user_id = ? AND asset_symbol = ?", [newAssetAmount, userId, assetSymbol]);
                } else {
                    db.run("INSERT INTO portfolio (user_id, asset_symbol, amount) VALUES (?, ?, ?)", [userId, assetSymbol, newAssetAmount]);
                }
                
                db.run("INSERT INTO transactions (user_id, type, asset_symbol, amount, price, total_cost) VALUES (?, ?, ?, ?, ?, ?)", 
                    [userId, type, assetSymbol, amount, price, totalCost]);

                db.run("COMMIT", (err) => {
                    if (err) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: "İşlem başarısız" });
                    }
                    res.json({ success: true, newBalance, newAssetAmount });
                });
            });
        });
    });
});

// Geçmiş İşlemleri Getir
router.get('/transactions/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all("SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC", [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
