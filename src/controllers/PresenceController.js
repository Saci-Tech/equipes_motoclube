const BaseController = require('./BaseController');
const presenceModel = require('../models/PresenceModel');

class PresenceController extends BaseController {
    constructor() {
        super(presenceModel, 'Presence');

        this.getByEvent = this.getByEvent.bind(this);
        this.getByMember = this.getByMember.bind(this);
    }

    /**
     * Sobrescreve o método create para exigir eventId e memberId
     */
    async create(req, res) {
        const payload = req.body;

        if (!payload || !payload.eventId || !payload.memberId) {
            return this.sendError(res, 'Missing required fields: eventId and memberId are required', 400);
        }

        return super.create(req, res);
    }

    /**
     * Busca todas as presenças vinculadas a um evento
     */
    async getByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const presences = await presenceModel.findByEventId(eventId);

            return this.sendSuccess(res, presences, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Busca o histórico de presenças de um membro
     */
    async getByMember(req, res) {
        try {
            const { memberId } = req.params;
            const presences = await presenceModel.findByMemberId(memberId);

            return this.sendSuccess(res, presences, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = new PresenceController();