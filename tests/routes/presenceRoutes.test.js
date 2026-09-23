// =========================================================================
// TESTE UNITÁRIO DE ROTAS: PresenceRoutes.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const presenceRoutes = require('../../src/routes/presenceRoutes');
const presenceController = require('../../src/controllers/PresenceController');

jest.mock('../../src/controllers/PresenceController');

const app = express();
app.use(express.json());
app.use('/presences', presenceRoutes);

describe('Presence Routes (Rotas de Presenças)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /presences deve chamar getAll', async () => {
        presenceController.getAll.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/presences');
        expect(res.status).toBe(200);
        expect(presenceController.getAll).toHaveBeenCalled();
    });

    it('GET /presences/:id deve chamar getById', async () => {
        presenceController.getById.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/presences/1');
        expect(res.status).toBe(200);
        expect(presenceController.getById).toHaveBeenCalled();
    });

    it('GET /presences/event/:eventId deve chamar getByEvent', async () => {
        presenceController.getByEvent.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/presences/event/5');
        expect(res.status).toBe(200);
        expect(presenceController.getByEvent).toHaveBeenCalled();
    });

    it('GET /presences/member/:memberId deve chamar getByMember', async () => {
        presenceController.getByMember.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/presences/member/10');
        expect(res.status).toBe(200);
        expect(presenceController.getByMember).toHaveBeenCalled();
    });

    it('POST /presences deve chamar create', async () => {
        presenceController.create.mockImplementation((req, res) => res.status(201).json({}));
        const res = await request(app).post('/presences').send({});
        expect(res.status).toBe(201);
        expect(presenceController.create).toHaveBeenCalled();
    });

    it('PUT /presences/:id deve chamar update', async () => {
        presenceController.update.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).put('/presences/1').send({});
        expect(res.status).toBe(200);
        expect(presenceController.update).toHaveBeenCalled();
    });

    it('DELETE /presences/:id deve chamar delete', async () => {
        presenceController.delete.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).delete('/presences/1');
        expect(res.status).toBe(200);
        expect(presenceController.delete).toHaveBeenCalled();
    });
});