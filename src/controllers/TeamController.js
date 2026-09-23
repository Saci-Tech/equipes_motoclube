const BaseController = require('./BaseController');
const teamModel = require('../models/TeamModel');

class TeamController extends BaseController {
    constructor() {
        super(teamModel, 'Team');

        this.getByName = this.getByName.bind(this);
        this.getByCategory = this.getByCategory.bind(this);
    }

    /**
     * Sobrescreve o create para adicionar validação de nome
     */
    async create(req, res) {
        const payload = req.body;

        if (!payload || !payload.name) {
            return this.sendError(res, 'Missing required field: name is required', 400);
        }

        return super.create(req, res);
    }

    /**
     * Busca equipe pelo nome
     */
    async getByName(req, res) {
        try {
            const { name } = req.params;
            const team = await teamModel.findByName(name);

            if (!team) {
                return this.sendError(res, 'Team not found', 404);
            }

            return this.sendSuccess(res, team, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Lista equipes por categoria
     */
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const teams = await teamModel.findByCategory(category);

            return this.sendSuccess(res, teams, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = new TeamController();