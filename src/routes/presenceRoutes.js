const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/PresenceController');

router.get('/', presenceController.getAll);
router.get('/event/:eventId', presenceController.getByEvent);
router.get('/member/:memberId', presenceController.getByMember);
router.get('/:id', presenceController.getById);
router.post('/', presenceController.create);
router.put('/:id', presenceController.update);
router.delete('/:id', presenceController.delete);

module.exports = router;