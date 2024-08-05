const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database(path.join(__dirname, '10.3', 'myDB.db'));
const port = 3000;

// Create the BuyNow table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS BuyNow (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  message TEXT
)`);

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// REST endpoint for storing Buy Now data
app.post('/buynowdata', (req, res) => {
  const { name, email, phone, delivery, quantity, message } = req.body;

  // Insert the form data into the BuyNow table using parameterized queries
  db.run(`INSERT INTO BuyNow (name, email, phone, delivery, quantity, message) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, phone, delivery, quantity, message], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log('Buy Now data inserted successfully');
    res.status(200).redirect('/Buy Now.html');
  });
});

// REST endpoint for getting Buy Now data
app.get('/buynowdata', (req, res) => {
  let html = '';

  // HTML code to display a table populated with the data from the BuyNow table
  html += '<!doctype html><html lang="en">';
  html += '<head>';
  html += '<title>Buy Now Data</title>';
  html += '<meta charset="utf-8">';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
  html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/css/bootstrap.min.css" integrity="sha384-aFq/bzH65dt+w6FI2ooMVUpc+21e0SRygnTpmBvdBgSdnuTN7QbdgL+OapgHtvPp" crossorigin="anonymous">';
  html += '</head>';
  html += '<body><div class="container">';
  html += '<h3>Buy Now Data Table</h3>';
  html += '<table class="table">';
  html += '<thead class="thead-dark"><tr>';
  html += '<th>Name</th><th>Email</th><th>Phone</th><th>Delivery</th><th>Quantity</th><th>Message</th>';
  html += '</tr></thead><tbody>';

  // Retrieve data from BuyNow table on the server and display it in a web page table structure
  db.all('SELECT * FROM BuyNow', (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    if (rows.length === 0) {
      html += '<tr><td colspan="6">No data found</td></tr>';
    } else {
      rows.forEach((row) => {
        html += '<tr>';
        html += `<td>${row.name}</td>`;
        html += `<td>${row.email}</td>`;
        html += `<td>${row.phone}</td>`;
        html += `<td>${row.delivery}</td>`;
        html += `<td>${row.quantity}</td>`;
        html += `<td>${row.message}</td>`;
        html += '</tr>';
      });
    }

    html += '</tbody></table>';
    html += '</div></body></html>';
    res.send(html);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Web server running at: http://localhost:${port}`);
  console.log("Type Ctrl+C to shut down the web server");
});
