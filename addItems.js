// Import library
const admin = require('firebase-admin');
// Inisialisasi Firebase Admin SDK dengan service account key
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Mendapatkan referensi Firestore
const db = admin.firestore();

// Fungsi untuk membuat data baru dalam koleksi 'items'
async function createItem(name, description, price) {
    try {
        const docRef = await db.collection('items').add({
            name: name,
            description: description,
            price: price
        });
        console.log('Document added with ID:', docRef.id);
    } catch (error) {
        console.error('Error adding document:', error);
    }
}

// Fungsi untuk memasukkan beberapa data
async function insertItems() {
    // Data yang ingin dimasukkan
    const items = [
        { name: 'Product 1', description: 'Description of Product 1', price: 100 },
        { name: 'Product 2', description: 'Description of Product 2', price: 150 },
        { name: 'Product 3', description: 'Description of Product 3', price: 200 }
    ];

    // Memasukkan setiap data ke Firestore
    items.forEach(item => {
        createItem(item.name, item.description, item.price);
    });
}

// Memanggil fungsi untuk memasukkan data
insertItems();
