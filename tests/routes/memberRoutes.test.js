// =========================================================================
// TESTE UNITÁRIO DE ROTAS: MemberRoutes.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const memberRoutes = require('../../src/routes/memberRoutes');
const memberController = require('../../src/controllers/MemberController');

jest.mock('../../src/controllers/MemberController');

const app = express();
app.use(express.json());
app.use('/members', memberRoutes);

describe('Member Routes (Rotas de Membros)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /members deve chamar getAll', async () => {
        memberController.getAll.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/members');
        expect(res.status).toBe(200);
        expect(memberController.getAll).toHaveBeenCalled();
    });

    it('GET /members/:id deve chamar getById', async () => {
        memberController.getById.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/members/1');
        expect(res.status).toBe(200);
        expect(memberController.getById).toHaveBeenCalled();
    });

    it('POST /members deve chamar create', async () => {
        memberController.create.mockImplementation((req, res) => res.status(201).json({}));
        const res = await request(app).post('/members').send({});
        expect(res.status).toBe(201);
        expect(memberController.create).toHaveBeenCalled();
    });

    it('PUT /members/:id deve chamar update', async () => {
        memberController.update.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).put('/members/1').send({});
        expect(res.status).toBe(200);
        expect(memberController.update).toHaveBeenCalled();
    });

    it('DELETE /members/:id deve chamar delete', async () => {
        memberController.delete.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).delete('/members/1');
        expect(res.status).toBe(200);
        expect(memberController.delete).toHaveBeenCalled();
    });
});