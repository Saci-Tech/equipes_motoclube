const AccessProfileController = require('../../src/controllers/AccessProfileController');
const BaseController = require('../../src/controllers/BaseController');
const accessProfileMock = require('../mocks/accessProfileModel.mock');

jest.mock('../../src/models/AccessProfileModel', () => {
    return jest.fn().mockImplementation(() => ({
        getRecords: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByName: jest.fn()
    }));
});

describe('AccessProfileController Unit Tests - 100% Coverage', () => {
    let controller;
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new AccessProfileController();

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
        test('deve retornar 200 e a lista de perfis de acesso', async () => {
            const mockList = accessProfileMock.allRecords || [{ id: 1, nome: 'Admin' }];
            controller.model.getRecords.mockResolvedValueOnce(mockList);

            await controller.getAll(req, res);

            expect(controller.model.getRecords).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });
    });

    describe('getById (Herdado de BaseController via POST)', () => {
        test('deve retornar 400 se o ID não for fornecido no payload', async () => {
            await controller.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O ID é obrigatório no corpo da requisição.' });
        });

        test('deve retornar 200 e o perfil quando encontrado', async () => {
            const targetRecord = accessProfileMock.validRecord || { id: 1, nome: 'Admin' };
            req.body = { id: targetRecord.id };
            
            controller.model.findById.mockResolvedValueOnce(targetRecord);

            await controller.getById(req, res);

            expect(controller.model.findById).toHaveBeenCalledWith(targetRecord.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(targetRecord);
        });
    });

    describe('create (Herdado de BaseController via POST)', () => {
        test('deve criar um perfil de acesso com sucesso e retornar 201', async () => {
            const payload = accessProfileMock.validPayload || { nome: 'Novo Perfil' };
            req.body = payload;
            controller.model.create.mockResolvedValueOnce(1);

            await controller.create(req, res);

            expect(controller.model.create).toHaveBeenCalledWith(payload);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
        });
    });

    describe('update (Herdado de BaseController via POST)', () => {
        test('deve atualizar o perfil quando enviado ID e dados no payload', async () => {
            const updatePayload = accessProfileMock.validUpdatePayload || { id: 1, nome: 'Atualizado' };
            req.body = updatePayload;
            controller.model.update.mockResolvedValueOnce(1);

            await controller.update(req, res);

            expect(controller.model.update).toHaveBeenCalledWith(updatePayload.id, expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('delete (Herdado de BaseController via POST)', () => {
        test('deve remover o perfil de acesso com sucesso', async () => {
            req.body = { id: 1 };
            controller.model.delete.mockResolvedValueOnce(1);

            await controller.delete(req, res);

            expect(controller.model.delete).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('findByName (Busca Customizada via POST)', () => {
        test('deve retornar 400 se o nome não for fornecido no payload', async () => {
            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'O campo "nome" é obrigatório no corpo da requisição.' });
        });

        test('deve retornar 200 e o perfil quando encontrado pelo nome no payload', async () => {
            const targetRecord = accessProfileMock.validRecord || { id: 1, nome: 'Admin' };
            req.body = { nome: targetRecord.nome };
            controller.model.findByName.mockResolvedValueOnce(targetRecord);

            await controller.findByName(req, res);

            expect(controller.model.findByName).toHaveBeenCalledWith(targetRecord.nome);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(targetRecord);
        });

        test('deve retornar 404 quando o perfil não for encontrado pelo nome', async () => {
            req.body = { nome: 'Inexistente' };
            controller.model.findByName.mockResolvedValueOnce(null);

            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Perfil de acesso não encontrado.' });
        });

        test('deve retornar 500 em caso de erro interno', async () => {
            req.body = { nome: 'Admin' };
            controller.model.findByName.mockRejectedValueOnce(new Error('DB Error'));

            await controller.findByName(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});