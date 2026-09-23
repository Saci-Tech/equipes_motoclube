// =========================================================================
// TESTE UNITÁRIO DE ROTAS: TeamRoutes.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const teamRoutes = require('../../src/routes/teamRoutes');
const teamController = require('../../src/controllers/TeamController');

jest.mock('../../src/controllers/TeamController');

const app = express();
app.use(express.json());
app.use('/teams', teamRoutes);

describe('Team Routes (Rotas de Equipes)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /teams deve chamar getAll', async () => {
        teamController.getAll.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/teams');
        expect(res.status).toBe(200);
        expect(teamController.getAll).toHaveBeenCalled();
    });

    it('GET /teams/:id deve chamar getById', async () => {
        teamController.getById.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/teams/1');
        expect(res.status).toBe(200);
        expect(teamController.getById).toHaveBeenCalled();
    });

    it('POST /teams deve chamar create', async () => {
        teamController.create.mockImplementation((req, res) => res.status(201).json({}));
        const res = await request(app).post('/teams').send({});
        expect(res.status).toBe(201);
        expect(teamController.create).toHaveBeenCalled();
    });

    it('PUT /teams/:id deve chamar update', async () => {
        teamController.update.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).put('/teams/1').send({});
        expect(res.status).toBe(200);
        expect(teamController.update).toHaveBeenCalled();
    });

    it('DELETE /teams/:id deve chamar delete', async () => {
        teamController.delete.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).delete('/teams/1');
        expect(res.status).toBe(200);
        expect(teamController.delete).toHaveBeenCalled();
    });
});