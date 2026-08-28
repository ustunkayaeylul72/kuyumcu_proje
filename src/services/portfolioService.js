// portfolioService.js
// Sahte (Mock) LocalStorage Backend'i

const PORTFOLIO_KEY = 'aurumx_portfolio';
const TRANSACTIONS_KEY = 'aurumx_transactions';

// Başlangıç değerleri
const DEFAULT_PORTFOLIO = {
    balance: 100000, // 100.000 TL başlangıç bakiyesi
    assets: {}
};

// LocalStorage'dan verileri getir (Eğer yoksa default değerleri ata)
const getStoredPortfolio = () => {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : DEFAULT_PORTFOLIO;
};

const getStoredTransactions = () => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
};

// Portföyü ve işlemleri kaydet
const savePortfolio = (portfolio) => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
};

const saveTransactions = (transactions) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

/**
 * Piyasadan güncel fiyatları alarak ROI hesaplamalı portföy döner.
 * @param {Object} marketPrices - { 'GRAM': 7067.84, 'USD': 48.24 } formatında fiyat haritası
 */
export const getPortfolio = (marketPrices = {}) => {
    const portfolio = getStoredPortfolio();
    const transactions = getStoredTransactions();
    
    const assetsData = {};

    Object.keys(portfolio.assets).forEach(symbol => {
        const currentAmount = portfolio.assets[symbol].amount;
        
        let totalCost = 0;
        let totalBoughtAmount = 0;

        // İlgili varlığın alış işlemlerinden ortalama maliyet hesapla
        transactions.forEach(tx => {
            if (tx.asset_symbol === symbol && tx.type === 'BUY') {
                totalCost += (tx.price * tx.amount);
                totalBoughtAmount += tx.amount;
            }
        });

        let avgPrice = 0;
        let roi = 0;

        if (totalBoughtAmount > 0) {
            avgPrice = totalCost / totalBoughtAmount;
            // Piyasadan anlık fiyat geldiyse ROI hesapla, yoksa 0.
            const currentPrice = marketPrices[symbol] || avgPrice; 
            roi = ((currentPrice - avgPrice) / avgPrice) * 100;
        }

        assetsData[symbol] = {
            amount: currentAmount,
            avgPrice: avgPrice,
            roi: roi.toFixed(2)
        };
    });

    return {
        balance: portfolio.balance,
        assets: assetsData
    };
};

/**
 * Geçmiş işlem kayıtlarını döner.
 */
export const getTransactions = () => {
    // Tarihe göre yeniden eskiye sıralı dön
    const transactions = getStoredTransactions();
    return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Alım/Satım işlemini gerçekleştirir.
 */
export const executeTrade = async (userId, type, assetSymbol, amount, price) => {
    const portfolio = getStoredPortfolio();
    const transactions = getStoredTransactions();
    
    const totalCost = amount * price;

    let currentAssetAmount = portfolio.assets[assetSymbol] ? portfolio.assets[assetSymbol].amount : 0;
    let newBalance = portfolio.balance;
    let newAssetAmount = currentAssetAmount;

    if (type === 'BUY') {
        if (newBalance < totalCost) {
            return { success: false, error: "Yetersiz Bakiye" };
        }
        newBalance -= totalCost;
        newAssetAmount += amount;
    } else if (type === 'SELL') {
        if (currentAssetAmount < amount) {
            return { success: false, error: "Yetersiz Varlık Miktarı" };
        }
        newBalance += totalCost;
        newAssetAmount -= amount;
    } else {
        return { success: false, error: "Geçersiz işlem tipi" };
    }

    // Portföyü güncelle
    portfolio.balance = newBalance;
    
    if (newAssetAmount === 0) {
        // Varlık tamamen satıldıysa objeden sil (isteğe bağlı, ama tutmak da sorun olmaz)
        portfolio.assets[assetSymbol] = { amount: 0 }; 
    } else {
        portfolio.assets[assetSymbol] = { amount: newAssetAmount };
    }

    savePortfolio(portfolio);

    // İşlem geçmişine kaydet
    const newTransaction = {
        id: Math.floor(Math.random() * 1000000), // Basit rastgele ID
        user_id: userId,
        type: type,
        asset_symbol: assetSymbol,
        amount: amount,
        price: price,
        total_cost: totalCost,
        timestamp: new Date().getTime()
    };

    transactions.push(newTransaction);
    saveTransactions(transactions);

    return { success: true, newBalance, newAssetAmount };
};
