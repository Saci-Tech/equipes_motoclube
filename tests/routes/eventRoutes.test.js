// =========================================================================
// TESTE UNITÁRIO DE ROTAS: EventRoutes.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const eventRoutes = require('../../src/routes/eventRoutes');
const eventController = require('../../src/controllers/EventController');

jest.mock('../../src/controllers/EventController');

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

describe('Event Routes (Rotas de Eventos)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /events deve chamar getAll', async () => {
        eventController.getAll.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/events');
        expect(res.status).toBe(200);
        expect(eventController.getAll).toHaveBeenCalled();
    });

    it('GET /events/:id deve chamar getById', async () => {
        eventController.getById.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/events/1');
        expect(res.status).toBe(200);
        expect(eventController.getById).toHaveBeenCalled();
    });

    it('POST /events deve chamar create', async () => {
        eventController.create.mockImplementation((req, res) => res.status(201).json({}));
        const res = await request(app).post('/events').send({});
        expect(res.status).toBe(201);
        expect(eventController.create).toHaveBeenCalled();
    });

    it('PUT /events/:id deve chamar update', async () => {
        eventController.update.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).put('/events/1').send({});
        expect(res.status).toBe(200);
        expect(eventController.update).toHaveBeenCalled();
    });

    it('DELETE /events/:id deve chamar delete', async () => {
        eventController.delete.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).delete('/events/1');
        expect(res.status).toBe(200);
        expect(eventController.delete).toHaveBeenCalled();
    });
});