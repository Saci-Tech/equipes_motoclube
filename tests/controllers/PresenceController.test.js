// =========================================================================
// TESTE UNITÁRIO: PresenceController.test.js
// =========================================================================

const presenceController = require('../../src/controllers/PresenceController');
const presenceModel = require('../../src/models/PresenceModel');
const {
    apiPayloadMock,
    deserializedPresenceMock,
    deserializedPresenceListMock
} = require('../mocks/Presence.mock');

jest.mock('../../src/models/PresenceModel');

describe('PresenceController (Controller de Presenças)', () => {
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
        it('deve registrar presença com sucesso e retornar 201', async () => {
            req.body = apiPayloadMock;
            presenceModel.create.mockResolvedValueOnce(1);
            presenceModel.findById.mockResolvedValueOnce(deserializedPresenceMock);

            await presenceController.create(req, res);

            expect(presenceModel.create).toHaveBeenCalledWith(apiPayloadMock);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedPresenceMock
            });
        });

        it('deve retornar status 400 se faltar o campo "eventId"', async () => {
            req.body = { memberId: 10 };

            await presenceController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing required fields: eventId and memberId are required'
            });
        });

        it('deve retornar status 400 se faltar o campo "memberId"', async () => {
            req.body = { eventId: 5 };

            await presenceController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getByEvent', () => {
        it('deve retornar lista de presenças por evento com status 200', async () => {
            req.params.eventId = '5';
            presenceModel.findByEventId.mockResolvedValueOnce(deserializedPresenceListMock);

            await presenceController.getByEvent(req, res);

            expect(presenceModel.findByEventId).toHaveBeenCalledWith('5');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedPresenceListMock
            });
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.eventId = '5';
            presenceModel.findByEventId.mockRejectedValueOnce(new Error('Db error'));

            await presenceController.getByEvent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByMember', () => {
        it('deve retornar lista de presenças por membro com status 200', async () => {
            req.params.memberId = '10';
            presenceModel.findByMemberId.mockResolvedValueOnce(deserializedPresenceListMock);

            await presenceController.getByMember(req, res);

            expect(presenceModel.findByMemberId).toHaveBeenCalledWith('10');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 500 em caso de erro no model', async () => {
            req.params.memberId = '10';
            presenceModel.findByMemberId.mockRejectedValueOnce(new Error('Db error'));

            await presenceController.getByMember(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});