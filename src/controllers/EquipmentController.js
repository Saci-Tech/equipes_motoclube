const BaseController = require('./BaseController');
const EquipmentModel = require('../models/EquipmentModel');

class EquipmentController extends BaseController {
    constructor() {
        super(new EquipmentModel());
    }

    findByName = async (req, res) => {
        try {
            const { nome } = req.body;

            if (!nome) {
                return res.status(400).json({ error: 'O campo "nome" é obrigatório no corpo da requisição.' });
            }

            const data = await this.model.findByName(nome);

            if (!data) {
                return res.status(404).json({ error: 'Equipamento não encontrado.' });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
        }
    };

    findWithMembers = async (req, res) => {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'O ID do equipamento é obrigatório no corpo da requisição.' });
            }

            const data = await this.model.findWithMembers(id);

            if (!data) {
                return res.status(404).json({ error: 'Equipamento não encontrado ou sem vínculos.' });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
        }
    };
}

module.exports = EquipmentController;