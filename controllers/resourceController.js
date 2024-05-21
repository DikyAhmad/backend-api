const db = require('../config/firestore');

// Mendapatkan semua item
module.exports.getAllItems = async (req, res) => {
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
};

// Mendapatkan item berdasarkan ID
module.exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('items').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ id: doc.id, data: doc.data() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Menambahkan item baru
module.exports.createItem = async (req, res) => {
  try {
    const { name, salary, country, city } = req.body;
    // Validasi data
    if (!name || !salary || !country || !city) {
      return res.status(400).json({ error: 'Name, salary, country, and city are required' });
    }
    // Menyimpan data ke Firestore
    const docRef = await db.collection('items').add({
      name: name,
      salary: salary,
      country: country,
      city: city
    });
    // Mengembalikan respons dengan ID dokumen yang baru dibuat
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Memperbarui item berdasarkan ID
module.exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, salary, country, city } = req.body;
    // Validasi data
    if (!name || !salary || !country || !city) {
      return res.status(400).json({ error: 'Name, salary, country, and city are required' });
    }
    // Memperbarui data di Firestore
    await db.collection('items').doc(id).set({
      name: name,
      salary: salary,
      country: country,
      city: city
    }, { merge: true });
    // Mengembalikan respons dengan data item yang telah diperbarui
    res.json({ id, name, salary, country, city });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Menghapus item berdasarkan ID
module.exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Menghapus data dari Firestore
    await db.collection('items').doc(id).delete();
    res.status(204).send(); // Tidak ada konten yang dikembalikan
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

