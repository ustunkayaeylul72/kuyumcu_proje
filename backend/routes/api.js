const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database');

// Helper function to get market data from reliable APIs
const fetchMarketData = async () => {
    try {
        // Döviz ve altın fiyatlarını iki farklı API'den çekeceğiz
        const [exchangeRates, goldData] = await Promise.all([
            fetchExchangeRates(),
            fetchGoldPrices()
        ]);

        const selected = [
            { key: 'USD', label: 'USD', prefix: '₺', data: exchangeRates },
            { key: 'EUR', label: 'EUR', prefix: '₺', data: exchangeRates },
            { key: 'GBP', label: 'GBP', prefix: '₺', data: exchangeRates },
            { key: 'XAU', label: 'ONS', prefix: '$', data: goldData },
            { key: 'GRAM', label: 'GRAM', prefix: '₺', data: goldData },
            { key: 'CEYREK', label: 'ÇEYREK', prefix: '₺', data: goldData },
            { key: 'CUMHURIYET', label: 'CUMHURİYET', prefix: '₺', data: goldData }
        ];

        const formattedData = selected.map(item => {
            const sourceData = item.data;
            if (!sourceData || !sourceData[item.key]) return null;

            const rawItem = sourceData[item.key];
            const price = rawItem.price;
            const change = rawItem.change || 0;
            
            let trend = change < 0 ? 'down' : 'up';
            if (change === 0) trend = 'stable';

            const displayPrice = price.toString().startsWith('$') ? price : `${item.prefix}${price}`;
            const numericPrice = typeof price === 'string' 
                ? parseFloat(price.replace('.', '').replace(',', '.'))
                : price;

            return {
                symbol: item.label,
                price: displayPrice,
                trend: trend,
                numericPrice: numericPrice,
                changePercent: change
            };
        }).filter(Boolean);

        return formattedData;
    } catch (error) {
        console.error("Market data fetch error:", error.message);
        throw new Error("Pazar verileri alınamadı: " + error.message);
    }
};

// Exchange rates API - Merkez Bankası ve ExchangeRate API
const fetchExchangeRates = async () => {
    try {
        // ExchangeRate API (güncel, güvenilir)
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/TRY', {
            timeout: 8000
        });
        
        const rates = response.data.rates;
        
        // Ters çevirme: TRY cinsinden USD, EUR, GBP fiyatları
        const tryToUsd = 1 / rates.USD;
        const tryToEur = 1 / rates.EUR;
        const tryToGbp = 1 / rates.GBP;

        return {
            USD: { 
                price: tryToUsd.toFixed(2), 
                change: 0 // Gerçek change verisi için 2 API karşılaştırması gerekli
            },
            EUR: { 
                price: tryToEur.toFixed(2), 
                change: 0 
            },
            GBP: { 
                price: tryToGbp.toFixed(2), 
                change: 0 
            }
        };
    } catch (error) {
        console.error("Exchange rates API error:", error.message);
        // Fallback değerler
        return {
            USD: { price: '32.00', change: 0 },
            EUR: { price: '35.00', change: 0 },
            GBP: { price: '40.00', change: 0 }
        };
    }
};

// Gold prices API - Metals API veya alternatifleri
const fetchGoldPrices = async () => {
    try {
        // metals.live API - Ons altın fiyatı (USD/oz)
        const response = await axios.get('https://api.metals.live/v1/spot/gold', {
            timeout: 8000
        });
        
        const goldPriceUsd = response.data.price; // USD cinsinden
        
        // Gram altın hesaplaması (1 ons = 31.1035 gram)
        const gramGold = (goldPriceUsd / 31.1035).toFixed(2);
        
        // Türk gram altın fiyatı (TRY) - Yaklaşık olarak
        // Not: Gerçek TRY fiyatı için döviz kuru uygulanmalı
        // Burada örnek olarak 32 TRY/USD oranı kullanılıyor
        const gramGoldTry = (gramGold * 32).toFixed(2);
        const ceyrekGoldTry = (gramGoldTry * 2.8345).toFixed(2); // 1 çeyrek = 2.8345 gram
        const cumhuriyetGoldTry = (gramGoldTry * 7.988).toFixed(2); // 1 Cumhuriyet altını = 7.988 gram

        return {
            XAU: { 
                price: goldPriceUsd.toFixed(2), 
                change: 0 
            },
            GRAM: { 
                price: gramGoldTry, 
                change: 0 
            },
            CEYREK: { 
                price: ceyrekGoldTry, 
                change: 0 
            },
            CUMHURIYET: { 
                price: cumhuriyetGoldTry, 
                change: 0 
            }
        };
    } catch (error) {
        console.error("Gold prices API error:", error.message);
        // Fallback değerler
        return {
            XAU: { price: '2000', change: 0 },
            GRAM: { price: '67', change: 0 },
            CEYREK: { price: '190', change: 0 },
            CUMHURIYET: { price: '535', change: 0 }
        };
    }
};

// Market verilerini API'lerden çek
router.get('/market', async (req, res) => {
    try {
        const formattedData = await fetchMarketData();
        
        // Sembol formatını UI beklentisine göre düzenle
        const uiData = formattedData.map(item => ({
            ...item,
            symbol: ['USD', 'EUR', 'GBP'].includes(item.symbol) ? `${item.symbol}/TRY` : 
                    item.symbol === 'ONS' ? 'ONS Altın' : 
                    item.symbol === 'GRAM' ? 'GRAM Altın' : 
                    item.symbol === 'ÇEYREK' ? 'ÇEYREK Altın' :
                    item.symbol === 'CUMHURİYET' ? 'Cumhuriyet Altını' : item.symbol
        }));
        
        res.json(uiData);
    } catch (error) {
        console.error("Market data error:", error.message);
        res.status(500).json({ error: "Pazar verileri alınamadı: " + error.message });
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
            if (!userRow) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

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
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

// Alım-Satım İşlemi (Trade)
router.post('/trade', (req, res) => {
    const { userId, type, assetSymbol, amount, price } = req.body;
    
    // type: 'BUY' or 'SELL'
    const totalCost = amount * price;

    db.get("SELECT balance FROM users WHERE id = ?", [userId], (err, userRow) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!userRow) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

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
