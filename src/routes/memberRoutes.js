const express = require('express');
const router = express.Router();
const memberController = require('../controllers/MemberController');

router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.post('/', memberController.create);
router.put('/:id', memberController.update);
router.delete('/:id', memberController.delete);

module.exports = router;