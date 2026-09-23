const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/EquipmentController');

router.get('/', equipmentController.getAll);
router.get('/serial/:serialNumber', equipmentController.getBySerialNumber);
router.get('/category/:category', equipmentController.getByCategory);
router.get('/status/:status', equipmentController.getByStatus);
router.get('/:id', equipmentController.getById);
router.post('/', equipmentController.create);
router.put('/:id', equipmentController.update);
router.delete('/:id', equipmentController.delete);

module.exports = router;