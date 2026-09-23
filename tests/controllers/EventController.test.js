// =========================================================================
// TESTE UNITÁRIO: EventController.test.js
// =========================================================================

const eventController = require('../../src/controllers/EventController');
const eventModel = require('../../src/models/EventModel');
const {
    apiPayloadMock,
    deserializedEventMock,
    deserializedEventListMock
} = require('../mocks/Event.mock');

jest.mock('../../src/models/EventModel');

describe('EventController (Controller de Eventos)', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            query: {},
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    describe('create', () => {
        it('deve criar um novo evento com sucesso e retornar 201', async () => {
            req.body = apiPayloadMock;
            eventModel.create.mockResolvedValueOnce(1);
            eventModel.findById.mockResolvedValueOnce(deserializedEventMock);

            await eventController.create(req, res);

            expect(eventModel.create).toHaveBeenCalledWith(apiPayloadMock);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedEventMock
            });
        });

        it('deve retornar status 400 se faltar o campo "name"', async () => {
            req.body = { eventDate: '2026-10-15T14:00:00.000Z' };

            await eventController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing required fields: name and eventDate are required'
            });
        });

        it('deve retornar status 400 se faltar o campo "eventDate"', async () => {
            req.body = { name: 'Treino Tático' };

            await eventController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getByType', () => {
        it('deve retornar lista de eventos por tipo com status 200', async () => {
            req.params.type = 'TREINO';
            eventModel.findByType.mockResolvedValueOnce(deserializedEventListMock);

            await eventController.getByType(req, res);

            expect(eventModel.findByType).toHaveBeenCalledWith('TREINO');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedEventListMock
            });
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.type = 'TREINO';
            eventModel.findByType.mockRejectedValueOnce(new Error('Database error'));

            await eventController.getByType(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByStatus', () => {
        it('deve retornar lista de eventos por status com status 200', async () => {
            req.params.status = 'AGENDADO';
            eventModel.findByStatus.mockResolvedValueOnce(deserializedEventListMock);

            await eventController.getByStatus(req, res);

            expect(eventModel.findByStatus).toHaveBeenCalledWith('AGENDADO');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.status = 'AGENDADO';
            eventModel.findByStatus.mockRejectedValueOnce(new Error('Query error'));

            await eventController.getByStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByDateRange', () => {
        it('deve retornar eventos dentro do intervalo de datas com status 200', async () => {
            req.query = { startDate: '2026-10-01', endDate: '2026-10-31' };
            eventModel.findByDateRange.mockResolvedValueOnce(deserializedEventListMock);

            await eventController.getByDateRange(req, res);

            expect(eventModel.findByDateRange).toHaveBeenCalledWith('2026-10-01', '2026-10-31');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 400 se faltar startDate ou endDate nos queryParams', async () => {
            req.query = { startDate: '2026-10-01' };

            await eventController.getByDateRange(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing query parameters: startDate and endDate are required'
            });
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.query = { startDate: '2026-10-01', endDate: '2026-10-31' };
            eventModel.findByDateRange.mockRejectedValueOnce(new Error('Interval error'));

            await eventController.getByDateRange(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});