const BaseController = require('../../src/controllers/BaseController');
const equipmentMock = require('../mocks/equipmentModel.mock');

describe('BaseController Unit Tests - 100% Coverage', () => {
    let mockModel;
    let controller;
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        mockModel = {
            getRecords: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        controller = new BaseController(mockModel);

        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getAll', () => {
        test('deve retornar 200 e a lista de registros com sucesso', async () => {
            const mockList = equipmentMock.allRecords || [{ id: 1, nome: 'Teste' }];
            mockModel.getRecords.mockResolvedValueOnce(mockList);

            await controller.getAll(req, res);

            expect(mockModel.getRecords).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        test('deve retornar 500 quando ocorrer um erro interno no model', async () => {
            mockModel.getRecords.mockRejectedValueOnce(new Error('Database Connection Error'));

            await controller.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ error: 'Erro interno no servidor.' })
            );
        });
    });

    describe('getById', () => {
        test('deve retornar 400 se o ID não for fornecido no payload', async () => {
            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID é obrigatório no corpo da requisição.' });
            expect(mockModel.findById).not.toHaveBeenCalled();
        });

        test('deve retornar 200 e o registro quando encontrado pelo ID no payload', async () => {
            const targetId = 1;
            req.body = { id: targetId };
            const mockRecord = { id: targetId, ...(equipmentMock.validPayload || {}) };
            
            mockModel.findById.mockResolvedValueOnce(mockRecord);

            await controller.getById(req, res);

            expect(mockModel.findById).toHaveBeenCalledWith(targetId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRecord);
        });

        test('deve retornar 404 quando o registro não for encontrado', async () => {
            req.body = { id: 9999 };
            mockModel.findById.mockResolvedValueOnce(null);

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Registro não encontrado.' });
        });

        test('deve retornar 500 em caso de erro na consulta por ID', async () => {
            req.body = { id: 1 };
            mockModel.findById.mockRejectedValueOnce(new Error('DB Error'));

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create', () => {
        test('deve retornar 201 e o ID gerado ao criar um registro com sucesso', async () => {
            const payload = equipmentMock.validPayload || { nome: 'Novo' };
            req.body = payload;
            mockModel.create.mockResolvedValueOnce(10);

            await controller.create(req, res);

            expect(mockModel.create).toHaveBeenCalledWith(payload);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Registro criado com sucesso.', id: 10 });
        });

        test('deve retornar 500 se ocorrer erro ao criar o registro', async () => {
            req.body = equipmentMock.validPayload || { nome: 'Novo' };
            mockModel.create.mockRejectedValueOnce(new Error('Insert Error'));

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update', () => {
        test('deve retornar 400 se o ID estiver ausente no payload de atualização', async () => {
            req.body = { nome: 'Apenas dados sem ID' };

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID é obrigatório no corpo da requisição.' });
            expect(mockModel.update).not.toHaveBeenCalled();
        });

        test('deve retornar 200 quando o registro for atualizado com sucesso', async () => {
            const payload = { id: 1, ...(equipmentMock.validPayload || { nome: 'Atualizado' }) };
            req.body = payload;
            mockModel.update.mockResolvedValueOnce(1);

            await controller.update(req, res);

            expect(mockModel.update).toHaveBeenCalledWith(1, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Registro atualizado com sucesso.' });
        });

        test('deve retornar 404 se nenhuma linha for afetada na atualização', async () => {
            req.body = { id: 9999, nome: 'Inexistente' };
            mockModel.update.mockResolvedValueOnce(0);

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Registro não encontrado ou nenhuma alteração realizada.' });
        });

        test('deve retornar 500 em caso de erro na atualização', async () => {
            req.body = { id: 1, nome: 'Erro' };
            mockModel.update.mockRejectedValueOnce(new Error('Update Error'));

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('delete', () => {
        test('deve retornar 400 se o ID não for fornecido para exclusão', async () => {
            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID é obrigatório no corpo da requisição.' });
            expect(mockModel.delete).not.toHaveBeenCalled();
        });

        test('deve retornar 200 quando o registro for removido com sucesso', async () => {
            const targetId = 1;
            req.body = { id: targetId };
            mockModel.delete.mockResolvedValueOnce(1);

            await controller.delete(req, res);

            expect(mockModel.delete).toHaveBeenCalledWith(targetId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Registro removido com sucesso.' });
        });

        test('deve retornar 404 se o registro não for encontrado para exclusão', async () => {
            req.body = { id: 9999 };
            mockModel.delete.mockResolvedValueOnce(0);

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Registro não encontrado.' });
        });

        test('deve retornar 500 em caso de erro na remoção', async () => {
            req.body = { id: 1 };
            mockModel.delete.mockRejectedValueOnce(new Error('Delete Error'));

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});