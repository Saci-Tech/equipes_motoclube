const express = require('express');
const router = express.Router();
const EquipmentController = require('../controllers/EquipmentController');

const controller = new EquipmentController();

router.post('/get-all', controller.getAll);
router.post('/get-by-id', controller.getById);
router.post('/create', controller.create);
router.post('/update', controller.update);
router.post('/delete', controller.delete);

module.exports = router;