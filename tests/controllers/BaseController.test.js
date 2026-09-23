// =========================================================================
// TESTE UNITÁRIO: BaseController.test.js
// =========================================================================

const BaseController = require('../../src/controllers/BaseController');

describe('BaseController (Controller Base Abstrato)', () => {
    let mockModel;
    let controller;
    let req;
    let res;

    beforeEach(() => {
        mockModel = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        controller = new BaseController(mockModel, 'TestResource');

        req = {
            params: {},
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe('Construtor', () => {
        it('deve usar "Resource" como resourceName padrao caso nao seja fornecido', () => {
            const defaultController = new BaseController(mockModel);
            expect(defaultController.resourceName).toBe('Resource');
        });
    });

    describe('Helpers de Resposta (sendSuccess, sendError)', () => {
        it('sendSuccess deve formatar resposta com status informado e envelope padrao', () => {
            controller.sendSuccess(res, { id: 1 }, 201);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
        });

        it('sendSuccess deve usar status code 200 por padrao se nao for informado', () => {
            controller.sendSuccess(res, { id: 1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 } });
        });

        it('sendError deve formatar erro simples sem objeto de erro', () => {
            controller.sendError(res, 'Not Found', 404);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Not Found' });
        });

        it('sendError deve formatar erro com objeto de erro contendo mensagem (Error instance)', () => {
            controller.sendError(res, 'Fail', 500, new Error('Db error'));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Fail',
                error: 'Db error'
            });
        });

        it('sendError deve formatar erro quando error for um objeto sem propriedade message', () => {
            const customObjError = { code: 1024, raw: 'Internal fault' };
            controller.sendError(res, 'Fail', 500, customObjError);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Fail',
                error: customObjError
            });
        });

        it('sendError deve formatar erro quando error for uma string', () => {
            controller.sendError(res, 'Fail', 500, 'Custom error string');
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Fail',
                error: 'Custom error string'
            });
        });

        it('sendError deve usar valores padrao de mensagem e status code', () => {
            controller.sendError(res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error'
            });
        });
    });

    describe('getAll', () => {
        it('deve retornar todos os itens com status 200', async () => {
            const list = [{ id: 1 }, { id: 2 }];
            mockModel.findAll.mockResolvedValueOnce(list);

            await controller.getAll(req, res);

            expect(mockModel.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: list });
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            mockModel.findAll.mockRejectedValueOnce(new Error('Database error'));

            await controller.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: 'Database error'
            });
        });
    });

    describe('getById', () => {
        it('deve retornar item encontrado com status 200', async () => {
            req.params.id = '1';
            mockModel.findById.mockResolvedValueOnce({ id: 1 });

            await controller.getById(req, res);

            expect(mockModel.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 404 quando item nao for encontrado', async () => {
            req.params.id = '999';
            mockModel.findById.mockResolvedValueOnce(null);

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'TestResource not found'
            });
        });

        it('deve retornar 500 em caso de erro', async () => {
            req.params.id = '1';
            mockModel.findById.mockRejectedValueOnce(new Error('Fatal error'));

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create', () => {
        it('deve criar novo item e retornar 201 com o recurso', async () => {
            req.body = { name: 'Novo' };
            mockModel.create.mockResolvedValueOnce(10);
            mockModel.findById.mockResolvedValueOnce({ id: 10, name: 'Novo' });

            await controller.create(req, res);

            expect(mockModel.create).toHaveBeenCalledWith({ name: 'Novo' });
            expect(mockModel.findById).toHaveBeenCalledWith(10);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('deve retornar 500 se o model falhar na criacao', async () => {
            req.body = { name: 'Novo' };
            mockModel.create.mockRejectedValueOnce(new Error('Creation failed'));

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update', () => {
        it('deve atualizar o item e retornar 200', async () => {
            req.params.id = '1';
            req.body = { name: 'Atualizado' };
            mockModel.update.mockResolvedValueOnce(true);
            mockModel.findById.mockResolvedValueOnce({ id: 1, name: 'Atualizado' });

            await controller.update(req, res);

            expect(mockModel.update).toHaveBeenCalledWith('1', { name: 'Atualizado' });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 404 se nada for alterado/nao encontrado', async () => {
            req.params.id = '999';
            mockModel.update.mockResolvedValueOnce(false);

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'TestResource not found or no changes made'
            });
        });

        it('deve retornar 500 em caso de excecao', async () => {
            req.params.id = '1';
            mockModel.update.mockRejectedValueOnce(new Error('Update failed'));

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('delete', () => {
        it('deve deletar registro e retornar status 200 com mensagem', async () => {
            req.params.id = '1';
            mockModel.delete.mockResolvedValueOnce(true);

            await controller.delete(req, res);

            expect(mockModel.delete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'TestResource deleted successfully'
            });
        });

        it('deve retornar 404 se registro nao existir', async () => {
            req.params.id = '999';
            mockModel.delete.mockResolvedValueOnce(false);

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'TestResource not found'
            });
        });

        it('deve retornar 500 se ocorrer erro', async () => {
            req.params.id = '1';
            mockModel.delete.mockRejectedValueOnce(new Error('Delete error'));

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});