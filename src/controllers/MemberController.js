const memberModel = require('../models/MemberModel');

class MemberController {
    /**
     * Lista todos os integrantes
     */
    async getAll(req, res) {
        try {
            const members = await memberModel.findAll();
            return res.status(200).json({
                success: true,
                data: members
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
     * Busca um integrante pelo ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const member = await memberModel.findById(id);

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: member
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
     * Cria um novo integrante
     */
    async create(req, res) {
        try {
            const payload = req.body;

            if (!payload || !payload.fullName || !payload.cpf) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: fullName and cpf are required'
                });
            }

            const insertId = await memberModel.create(payload);
            const newMember = await memberModel.findById(insertId);

            return res.status(201).json({
                success: true,
                data: newMember
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
     * Atualiza um integrante existente
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;

            const updated = await memberModel.update(id, payload);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found or no changes made'
                });
            }

            const member = await memberModel.findById(id);
            return res.status(200).json({
                success: true,
                data: member
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
     * Remove um integrante
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await memberModel.delete(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Member deleted successfully'
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
     * Busca por CPF
     */
    async getByCpf(req, res) {
        try {
            const { cpf } = req.params;
            const member = await memberModel.findByCpf(cpf);

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: member
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
     * Busca por Chave QR Code
     */
    async getByQrKey(req, res) {
        try {
            const { qrKey } = req.params;
            const member = await memberModel.findByQrKey(qrKey);

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Member not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: member
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
     * Lista integrantes de uma equipe
     */
    async getByTeamId(req, res) {
        try {
            const { teamId } = req.params;
            const members = await memberModel.findByTeamId(teamId);

            return res.status(200).json({
                success: true,
                data: members
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

module.exports = new MemberController();