const express = require('express');
const router = express.Router();

const equipmentRoutes = require('./equipmentRoutes');
const presenceRoutes = require('./presenceRoutes');
const memberRoutes = require('./memberRoutes');
const teamRoutes = require('./teamRoutes');
const eventRoutes = require('./eventRoutes');

router.use('/equipments', equipmentRoutes);
router.use('/presences', presenceRoutes);
router.use('/members', memberRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);

module.exports = router;