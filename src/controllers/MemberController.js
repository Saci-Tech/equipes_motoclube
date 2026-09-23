const BaseController = require('./BaseController');
const memberModel = require('../models/MemberModel');

class MemberController extends BaseController {
    constructor() {
        super(memberModel, 'Member');

        this.getByCpf = this.getByCpf.bind(this);
        this.getByQrKey = this.getByQrKey.bind(this);
        this.getByTeamId = this.getByTeamId.bind(this);
    }

    /**
     * Sobrescreve o create para adicionar validação de campos obrigatórios
     */
    async create(req, res) {
        const payload = req.body;

        if (!payload || !payload.fullName || !payload.cpf) {
            return this.sendError(res, 'Missing required fields: fullName and cpf are required', 400);
        }

        return super.create(req, res);
    }

    /**
     * Busca por CPF
     */
    async getByCpf(req, res) {
        try {
            const { cpf } = req.params;
            const member = await memberModel.findByCpf(cpf);

            if (!member) {
                return this.sendError(res, 'Member not found', 404);
            }

            return this.sendSuccess(res, member, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
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
                return this.sendError(res, 'Member not found', 404);
            }

            return this.sendSuccess(res, member, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Lista integrantes de uma equipe
     */
    async getByTeamId(req, res) {
        try {
            const { teamId } = req.params;
            const members = await memberModel.findByTeamId(teamId);

            return this.sendSuccess(res, members, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = new MemberController();