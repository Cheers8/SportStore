const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the directory exists
const dbDir = path.join(__dirname, '10.3');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'myDB.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not open database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(function() {
    db.run(`
        CREATE TABLE IF NOT EXISTS BuyNow (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            delivery TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            message TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('BuyNow table created successfully.');
        }
    });
});
db.close();
