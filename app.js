require('@google-cloud/debug-agent').start()
// Import library
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser')

// Inisialisasi aplikasi Express
const app = express();

// Inisialisasi Firebase Admin SDK dengan service account key
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Mendapatkan referensi Firestore
const db = admin.firestore();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

// Endpoint untuk mendapatkan semua dokumen pada koleksi 'items'
app.get('/items', async (req, res) => {
    try {
        const snapshot = await db.collection('items').get();
        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, data: doc.data() });
        });
        res.json(items);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/items', async (req, res) => {
    try {
        // Mendapatkan data dari body request
        const { name, description, price } = req.body;

        // Validasi data
        if (!name || !description || !price) {
            res.status(400).json({ error: 'Name, description, and price are required' });
            return;
        }

        // Menyimpan data ke Firestore
        const docRef = await db.collection('items').add({
            name: name,
            description: description,
            price: price
        });

        // Mengembalikan respons dengan ID dokumen yang baru dibuat
        res.json({ id: docRef.id });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})