class BaseController {
    /**
     * @param {Object} model Instance de BaseModel (ex: MemberModel)
     * @param {string} resourceName Nome do recurso para mensagens (ex: 'Member', 'Team')
     */
    constructor(model, resourceName = 'Resource') {
        this.model = model;
        this.resourceName = resourceName;

        // Binda o contexto das funções para não perder o 'this' quando passadas para rotas do Express
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**
     * Helper para padronizar respostas de sucesso
     */
    sendSuccess(res, data, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data
        });
    }

    /**
     * Helper para padronizar respostas de erro
     */
    sendError(res, message = 'Internal server error', statusCode = 500, error = null) {
        const response = {
            success: false,
            message
        };

        if (error) {
            response.error = typeof error === 'object' && error.message ? error.message : error;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Lista todos os registros
     */
    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            return this.sendSuccess(res, items, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Busca registro por ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await this.model.findById(id);

            if (!item) {
                return this.sendError(res, `${this.resourceName} not found`, 404);
            }

            return this.sendSuccess(res, item, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Cria um novo registro
     */
    async create(req, res) {
        try {
            const payload = req.body;
            const insertId = await this.model.create(payload);
            const newItem = await this.model.findById(insertId);

            return this.sendSuccess(res, newItem, 201);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Atualiza um registro
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const payload = req.body;

            const updated = await this.model.update(id, payload);

            if (!updated) {
                return this.sendError(res, `${this.resourceName} not found or no changes made`, 404);
            }

            const item = await this.model.findById(id);
            return this.sendSuccess(res, item, 200);
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }

    /**
     * Deleta um registro
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await this.model.delete(id);

            if (!deleted) {
                return this.sendError(res, `${this.resourceName} not found`, 404);
            }

            return res.status(200).json({
                success: true,
                message: `${this.resourceName} deleted successfully`
            });
        } catch (error) {
            return this.sendError(res, 'Internal server error', 500, error);
        }
    }
}

module.exports = BaseController;