const express = require('express');
const router = express.Router();

const memberRoutes = require('./memberRoutes');
const teamRoutes = require('./teamRoutes');
const eventRoutes = require('./eventRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const presenceRoutes = require('./presenceRoutes');

router.use('/members', memberRoutes);
router.use('/teams', teamRoutes);
router.use('/events', eventRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/presences', presenceRoutes);

module.exports = router;