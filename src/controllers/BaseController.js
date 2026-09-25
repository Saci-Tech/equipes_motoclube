class BaseController {
    constructor(model) {
        this.model = model;
    }

    getAll = async (req, res) => {
        try {
            const data = await this.model.getRecords();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'O ID é obrigatório no corpo da requisição.' });
            }

            const data = await this.model.findById(id);
            if (!data) {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
        }
    };

    create = async (req, res) => {
        try {
            const insertId = await this.model.create(req.body);
            return res.status(201).json({ message: 'Registro criado com sucesso.', id: insertId });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar registro.', details: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const { id, ...data } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'O ID é obrigatório no corpo da requisição.' });
            }

            const affectedRows = await this.model.update(id, data);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Registro não encontrado ou nenhuma alteração realizada.' });
            }

            return res.status(200).json({ message: 'Registro atualizado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar registro.', details: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'O ID é obrigatório no corpo da requisição.' });
            }

            const affectedRows = await this.model.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Registro não encontrado.' });
            }

            return res.status(200).json({ message: 'Registro removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover registro.', details: error.message });
        }
    };
}

module.exports = BaseController;