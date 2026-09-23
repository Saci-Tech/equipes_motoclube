const teamModel = require('../models/TeamModel');

class TeamController {
    /**
     * Lista todas as equipes
     */
    async getAll(req, res) {
        try {
            const teams = await teamModel.findAll();
            return res.status(200).json({
                success: true,
                data: teams
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Busca uma equipe por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const team = await teamModel.findById(id);

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: team
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Cria uma nova equipe
     */
    async create(req, res) {
        try {
            const payload = req.body;

            if (!payload || !payload.name) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required field: name is required'
                });
            }

            const insertId = await teamModel.create(payload);
            const newTeam = await teamModel.findById(insertId);

            return res.status(201).json({
                success: true,
                data: newTeam
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Atualiza dados de uma equipe
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;

            const updated = await teamModel.update(id, payload);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found or no changes made'
                });
            }

            const team = await teamModel.findById(id);
            return res.status(200).json({
                success: true,
                data: team
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Remove uma equipe
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await teamModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Team deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Busca equipe pelo nome
     */
    async getByName(req, res) {
        try {
            const { name } = req.params;
            const team = await teamModel.findByName(name);

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: team
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Lista equipes por categoria
     */
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const teams = await teamModel.findByCategory(category);

            return res.status(200).json({
                success: true,
                data: teams
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new TeamController();