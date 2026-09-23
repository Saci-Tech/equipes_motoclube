// =========================================================================
// TESTE DE INTEGRAÇÃO DE ROTAS: Equipment & Presence
// =========================================================================

const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes');

const equipmentController = require('../../src/controllers/EquipmentController');
const presenceController = require('../../src/controllers/PresenceController');

jest.mock('../../src/controllers/EquipmentController');
jest.mock('../../src/controllers/PresenceController');

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Rotas HTTP (Equipment e Presence)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Equipment Routes', () => {
        it('GET /api/equipments/serial/:serialNumber deve chamar getBySerialNumber', async () => {
            equipmentController.getBySerialNumber.mockImplementation((req, res) => res.status(200).json({ ok: true }));

            const response = await request(app).get('/api/equipments/serial/HT123456');

            expect(response.status).toBe(200);
            expect(equipmentController.getBySerialNumber).toHaveBeenCalled();
        });

        it('GET /api/equipments/category/:category deve chamar getByCategory', async () => {
            equipmentController.getByCategory.mockImplementation((req, res) => res.status(200).json({ ok: true }));

            const response = await request(app).get('/api/equipments/category/COMUNICACAO');

            expect(response.status).toBe(200);
            expect(equipmentController.getByCategory).toHaveBeenCalled();
        });

        it('GET /api/equipments/status/:status deve chamar getByStatus', async () => {
            equipmentController.getByStatus.mockImplementation((req, res) => res.status(200).json({ ok: true }));

            const response = await request(app).get('/api/equipments/status/DISPONIVEL');

            expect(response.status).toBe(200);
            expect(equipmentController.getByStatus).toHaveBeenCalled();
        });
    });

    describe('Presence Routes', () => {
        it('GET /api/presences/event/:eventId deve chamar getByEvent', async () => {
            presenceController.getByEvent.mockImplementation((req, res) => res.status(200).json({ ok: true }));

            const response = await request(app).get('/api/presences/event/5');

            expect(response.status).toBe(200);
            expect(presenceController.getByEvent).toHaveBeenCalled();
        });

        it('GET /api/presences/member/:memberId deve chamar getByMember', async () => {
            presenceController.getByMember.mockImplementation((req, res) => res.status(200).json({ ok: true }));

            const response = await request(app).get('/api/presences/member/10');

            expect(response.status).toBe(200);
            expect(presenceController.getByMember).toHaveBeenCalled();
        });
    });
});