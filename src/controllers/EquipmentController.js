const BaseController = require('./BaseController');
const equipmentModel = require('../models/EquipmentModel');

class EquipmentController extends BaseController {
    constructor() {
        super(equipmentModel, 'Equipment');

        this.getBySerialNumber = this.getBySerialNumber.bind(this);
        this.getByCategory = this.getByCategory.bind(this);
        this.getByStatus = this.getByStatus.bind(this);
    }

    /**
     * Sobrescreve create para garantir a presença do campo 'name'
     */
    async create(req, res) {
        const payload = req.body;

        if (!payload || !payload.name) {
            return this.sendError(res, 'Missing required field: name is required', 400);
        }

        return super.create(req, res);
    }

    /**
     * Busca equipamento pelo Número de Série
     */
    async getBySerialNumber(req, res) {
        try {
            const { serialNumber } = req.params;
            const equipment = await equipmentModel.findBySerialNumber(serialNumber);

            if (!equipment) {
                return this.sendError(res, 'Equipment not found', 404);
            }

            return this.sendSuccess(res, equipment, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Lista equipamentos por Categoria
     */
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const items = await equipmentModel.findByCategory(category);

            return this.sendSuccess(res, items, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Lista equipamentos por Status (ex: DISPONIVEL, EM_USO, MANUTENCAO)
     */
    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const items = await equipmentModel.findByStatus(status);

            return this.sendSuccess(res, items, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = new EquipmentController();