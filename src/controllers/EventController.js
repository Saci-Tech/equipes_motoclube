const BaseController = require('./BaseController');
const eventModel = require('../models/EventModel');

class EventController extends BaseController {
    constructor() {
        super(eventModel, 'Event');

        this.getByType = this.getByType.bind(this);
        this.getByStatus = this.getByStatus.bind(this);
        this.getByDateRange = this.getByDateRange.bind(this);
    }

    async create(req, res) {
        const payload = req.body;

        if (!payload || !payload.name || !payload.eventDate) {
            return this.sendError(res, 'Missing required fields: name and eventDate are required', 400);
        }

        return super.create(req, res);
    }

    async getByType(req, res) {
        try {
            const { type } = req.params;
            const events = await eventModel.findByType(type);

            return this.sendSuccess(res, events, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const events = await eventModel.findByStatus(status);

            return this.sendSuccess(res, events, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    async getByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                return this.sendError(res, 'Missing query parameters: startDate and endDate are required', 400);
            }

            const events = await eventModel.findByDateRange(startDate, endDate);
            return this.sendSuccess(res, events, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = new EventController();