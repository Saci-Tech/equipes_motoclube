// =========================================================================
// TESTE UNITÁRIO: EquipmentController.test.js
// =========================================================================

const equipmentController = require('../../src/controllers/EquipmentController');
const equipmentModel = require('../../src/models/EquipmentModel');
const {
    apiPayloadMock,
    deserializedEquipmentMock,
    deserializedEquipmentListMock
} = require('../mocks/Equipment.mock');

jest.mock('../../src/models/EquipmentModel');

describe('EquipmentController (Controller de Equipamentos)', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe('create', () => {
        it('deve criar um novo equipamento com sucesso e retornar 201', async () => {
            req.body = apiPayloadMock;
            equipmentModel.create.mockResolvedValueOnce(1);
            equipmentModel.findById.mockResolvedValueOnce(deserializedEquipmentMock);

            await equipmentController.create(req, res);

            expect(equipmentModel.create).toHaveBeenCalledWith(apiPayloadMock);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedEquipmentMock
            });
        });

        it('deve retornar status 400 se faltar o campo "name"', async () => {
            req.body = { serialNumber: 'HT123456' };

            await equipmentController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing required field: name is required'
            });
        });
    });

    describe('getBySerialNumber', () => {
        it('deve retornar o equipamento pelo número de série com status 200', async () => {
            req.params.serialNumber = 'HT123456';
            equipmentModel.findBySerialNumber.mockResolvedValueOnce(deserializedEquipmentMock);

            await equipmentController.getBySerialNumber(req, res);

            expect(equipmentModel.findBySerialNumber).toHaveBeenCalledWith('HT123456');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedEquipmentMock
            });
        });

        it('deve retornar status 404 quando o equipamento não for encontrado', async () => {
            req.params.serialNumber = 'INVALID';
            equipmentModel.findBySerialNumber.mockResolvedValueOnce(null);

            await equipmentController.getBySerialNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Equipment not found'
            });
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.serialNumber = 'HT123456';
            equipmentModel.findBySerialNumber.mockRejectedValueOnce(new Error('Db error'));

            await equipmentController.getBySerialNumber(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByCategory', () => {
        it('deve retornar lista de equipamentos por categoria com status 200', async () => {
            req.params.category = 'COMUNICACAO';
            equipmentModel.findByCategory.mockResolvedValueOnce(deserializedEquipmentListMock);

            await equipmentController.getByCategory(req, res);

            expect(equipmentModel.findByCategory).toHaveBeenCalledWith('COMUNICACAO');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.category = 'COMUNICACAO';
            equipmentModel.findByCategory.mockRejectedValueOnce(new Error('Db error'));

            await equipmentController.getByCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByStatus', () => {
        it('deve retornar lista de equipamentos por status com status 200', async () => {
            req.params.status = 'DISPONIVEL';
            equipmentModel.findByStatus.mockResolvedValueOnce(deserializedEquipmentListMock);

            await equipmentController.getByStatus(req, res);

            expect(equipmentModel.findByStatus).toHaveBeenCalledWith('DISPONIVEL');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.status = 'DISPONIVEL';
            equipmentModel.findByStatus.mockRejectedValueOnce(new Error('Db error'));

            await equipmentController.getByStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});