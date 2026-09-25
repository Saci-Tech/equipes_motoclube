const BaseController = require('./BaseController');
const AccessProfileModel = require('../models/AccessProfileModel');

class AccessProfileController extends BaseController {
    constructor() {
        super(new AccessProfileModel());
    }

    findByName = async (req, res) => {
        try {
            const { nome } = req.body;

            if (!nome) {
                return res.status(400).json({ error: 'O campo "nome" é obrigatório no corpo da requisição.' });
            }

            const data = await this.model.findByName(nome);

            if (!data) {
                return res.status(404).json({ error: 'Perfil de acesso não encontrado.' });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
        }
    };
}

module.exports = AccessProfileController;