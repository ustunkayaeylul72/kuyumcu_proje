const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Tabloları Oluştur
        db.serialize(() => {
            // Users table (bakiyeler vb.)
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                balance REAL DEFAULT 100000.00
            )`);

            // Portfolio table (kullanıcının elindeki varlıklar)
            db.run(`CREATE TABLE IF NOT EXISTS portfolio (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                asset_symbol TEXT,
                amount REAL DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, asset_symbol)
            )`);

            // Transactions table (alım satım geçmişi)
            db.run(`CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                type TEXT, -- 'BUY' or 'SELL'
                asset_symbol TEXT,
                amount REAL,
                price REAL,
                total_cost REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`);

            // Varsayılan Kullanıcı Oluştur (Admin veya Test Kullanıcısı)
            db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
                if (!row) {
                    db.run("INSERT INTO users (username, balance) VALUES ('admin', 150000.00)", function(err) {
                        if (!err) {
                            console.log("Default admin user created.");
                        }
                    });
                }
            });
        });
    }
});

module.exports = db;
