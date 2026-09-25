const EquipmentController = require('../../src/controllers/EquipmentController');
const BaseController = require('../../src/controllers/BaseController');
const equipmentMock = require('../mocks/equipmentModel.mock');

jest.mock('../../src/models/EquipmentModel', () => {
    return jest.fn().mockImplementation(() => ({
        getRecords: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByName: jest.fn(),
        findWithMembers: jest.fn()
    }));
});

describe('EquipmentController Unit Tests - 100% Coverage', () => {
    let controller;
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new EquipmentController();

        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('deve ser uma instância de BaseController', () => {
        expect(controller instanceof BaseController).toBeTruthy();
    });

    describe('getAll (Herdado de BaseController via POST)', () => {
        test('deve retornar 200 e a lista de equipamentos', async () => {
            const mockList = equipmentMock.allRecords || [{ id: 1, nome: 'Projetor' }];
            controller.model.getRecords.mockResolvedValueOnce(mockList);

            await controller.getAll(req, res);

            expect(controller.model.getRecords).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        test('deve retornar 500 se ocorrer erro interno', async () => {
            controller.model.getRecords.mockRejectedValueOnce(new Error('DB Error'));

            await controller.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getById (Herdado de BaseController via POST)', () => {
        test('deve retornar 400 se o ID não for fornecido no payload', async () => {
            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID é obrigatório no corpo da requisição.' });
        });

        test('deve retornar 200 e o equipamento quando encontrado', async () => {
            const targetRecord = equipmentMock.validRecord || { id: 1, nome: 'Projetor' };
            req.body = { id: targetRecord.id };
            controller.model.findById.mockResolvedValueOnce(targetRecord);

            await controller.getById(req, res);

            expect(controller.model.findById).toHaveBeenCalledWith(targetRecord.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(targetRecord);
        });

        test('deve retornar 404 quando o equipamento não for encontrado', async () => {
            req.body = { id: 999 };
            controller.model.findById.mockResolvedValueOnce(null);

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('deve retornar 500 em caso de erro interno', async () => {
            req.body = { id: 1 };
            controller.model.findById.mockRejectedValueOnce(new Error('DB Error'));

            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create (Herdado de BaseController via POST)', () => {
        test('deve criar um equipamento com sucesso e retornar 201', async () => {
            const payload = equipmentMock.validPayload || { nome: 'Notebook' };
            req.body = payload;
            controller.model.create.mockResolvedValueOnce(1);

            await controller.create(req, res);

            expect(controller.model.create).toHaveBeenCalledWith(payload);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
        });

        test('deve retornar 500 se ocorrer erro ao criar', async () => {
            req.body = equipmentMock.validPayload || { nome: 'Notebook' };
            controller.model.create.mockRejectedValueOnce(new Error('Insert Error'));

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update (Herdado de BaseController via POST)', () => {
        test('deve retornar 400 se o ID estiver ausente no payload', async () => {
            req.body = { nome: 'Atualizado sem ID' };

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('deve atualizar o equipamento quando enviado ID e dados no payload', async () => {
            const updatePayload = equipmentMock.validUpdatePayload || { id: 1, nome: 'Atualizado' };
            req.body = updatePayload;
            controller.model.update.mockResolvedValueOnce(1);

            await controller.update(req, res);

            expect(controller.model.update).toHaveBeenCalledWith(updatePayload.id, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('deve retornar 404 se nenhuma linha for afetada', async () => {
            req.body = { id: 999, nome: 'Inexistente' };
            controller.model.update.mockResolvedValueOnce(0);

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('deve retornar 500 em caso de erro na atualização', async () => {
            req.body = { id: 1, nome: 'Erro' };
            controller.model.update.mockRejectedValueOnce(new Error('Update Error'));

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('delete (Herdado de BaseController via POST)', () => {
        test('deve retornar 400 se o ID não for fornecido', async () => {
            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test('deve remover o equipamento com sucesso', async () => {
            req.body = { id: 1 };
            controller.model.delete.mockResolvedValueOnce(1);

            await controller.delete(req, res);

            expect(controller.model.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        test('deve retornar 404 se o registro não for encontrado para exclusão', async () => {
            req.body = { id: 999 };
            controller.model.delete.mockResolvedValueOnce(0);

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        test('deve retornar 500 em caso de erro na exclusão', async () => {
            req.body = { id: 1 };
            controller.model.delete.mockRejectedValueOnce(new Error('Delete Error'));

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('findByName (Busca Customizada via POST)', () => {
        test('deve retornar 400 se o nome não for fornecido no payload', async () => {
            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O campo "nome" é obrigatório no corpo da requisição.' });
        });

        test('deve retornar 200 e o equipamento quando encontrado pelo nome no payload', async () => {
            const targetRecord = equipmentMock.validRecord || { id: 1, nome: 'Projetor' };
            req.body = { nome: targetRecord.nome };
            controller.model.findByName.mockResolvedValueOnce(targetRecord);

            await controller.findByName(req, res);

            expect(controller.model.findByName).toHaveBeenCalledWith(targetRecord.nome);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(targetRecord);
        });

        test('deve retornar 404 quando o equipamento não for encontrado pelo nome', async () => {
            req.body = { nome: 'Inexistente' };
            controller.model.findByName.mockResolvedValueOnce(null);

            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Equipamento não encontrado.' });
        });

        test('deve retornar 500 em caso de erro interno', async () => {
            req.body = { nome: 'Projetor' };
            controller.model.findByName.mockRejectedValueOnce(new Error('DB Error'));

            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('findWithMembers (Busca Customizada via POST)', () => {
        test('deve retornar 400 se o ID não for fornecido no payload', async () => {
            await controller.findWithMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID do equipamento é obrigatório no corpo da requisição.' });
        });

        test('deve retornar 200 e os dados do equipamento com membros vinculados', async () => {
            const targetData = { id: 1, nome: 'Projetor', assignments: [] };
            req.body = { id: 1 };
            controller.model.findWithMembers.mockResolvedValueOnce(targetData);

            await controller.findWithMembers(req, res);

            expect(controller.model.findWithMembers).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(targetData);
        });

        test('deve retornar 404 quando não encontrar o equipamento ou vínculos', async () => {
            req.body = { id: 999 };
            controller.model.findWithMembers.mockResolvedValueOnce(null);

            await controller.findWithMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Equipamento não encontrado ou sem vínculos.' });
        });

        test('deve retornar 500 em caso de erro interno', async () => {
            req.body = { id: 1 };
            controller.model.findWithMembers.mockRejectedValueOnce(new Error('DB Error'));

            await controller.findWithMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});