// =========================================================================
// TESTE UNITÁRIO DE ROTAS: EquipmentRoutes.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const equipmentRoutes = require('../../src/routes/equipmentRoutes');
const equipmentController = require('../../src/controllers/EquipmentController');

jest.mock('../../src/controllers/EquipmentController');

const app = express();
app.use(express.json());
app.use('/equipments', equipmentRoutes);

describe('Equipment Routes (Rotas de Equipamentos)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /equipments deve chamar getAll', async () => {
        equipmentController.getAll.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/equipments');
        expect(res.status).toBe(200);
        expect(equipmentController.getAll).toHaveBeenCalled();
    });

    it('GET /equipments/:id deve chamar getById', async () => {
        equipmentController.getById.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/equipments/1');
        expect(res.status).toBe(200);
        expect(equipmentController.getById).toHaveBeenCalled();
    });

    it('GET /equipments/serial/:serialNumber deve chamar getBySerialNumber', async () => {
        equipmentController.getBySerialNumber.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).get('/equipments/serial/HT123456');
        expect(res.status).toBe(200);
        expect(equipmentController.getBySerialNumber).toHaveBeenCalled();
    });

    it('GET /equipments/category/:category deve chamar getByCategory', async () => {
        equipmentController.getByCategory.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/equipments/category/COMUNICACAO');
        expect(res.status).toBe(200);
        expect(equipmentController.getByCategory).toHaveBeenCalled();
    });

    it('GET /equipments/status/:status deve chamar getByStatus', async () => {
        equipmentController.getByStatus.mockImplementation((req, res) => res.status(200).json([]));
        const res = await request(app).get('/equipments/status/DISPONIVEL');
        expect(res.status).toBe(200);
        expect(equipmentController.getByStatus).toHaveBeenCalled();
    });

    it('POST /equipments deve chamar create', async () => {
        equipmentController.create.mockImplementation((req, res) => res.status(201).json({}));
        const res = await request(app).post('/equipments').send({});
        expect(res.status).toBe(201);
        expect(equipmentController.create).toHaveBeenCalled();
    });

    it('PUT /equipments/:id deve chamar update', async () => {
        equipmentController.update.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).put('/equipments/1').send({});
        expect(res.status).toBe(200);
        expect(equipmentController.update).toHaveBeenCalled();
    });

    it('DELETE /equipments/:id deve chamar delete', async () => {
        equipmentController.delete.mockImplementation((req, res) => res.status(200).json({}));
        const res = await request(app).delete('/equipments/1');
        expect(res.status).toBe(200);
        expect(equipmentController.delete).toHaveBeenCalled();
    });
});