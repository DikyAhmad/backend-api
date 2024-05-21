const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const checkApiKey = require('../middleware/checkApiKey');
const validateResource = require('../middleware/validation');

router.get('/items', checkApiKey, resourceController.getAllItems);
router.post('/items', checkApiKey, validateResource, resourceController.createItem);
router.get('/items/:id', checkApiKey, resourceController.getItemById);
router.put('/items/:id', checkApiKey, resourceController.updateItem);
router.delete('/items/:id', checkApiKey, resourceController.deleteItem);


module.exports = router;
