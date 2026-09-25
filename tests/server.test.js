// =========================================================================
// TESTE UNITÁRIO DO SERVIDOR: server.test.js
// =========================================================================

const request = require('supertest');
const app = require('../src/server');

jest.mock('../src/routes', () => {
    const express = require('express');
    const router = express.Router();
    router.get('/test-route', (req, res) => res.status(200).json({ ok: true }));
    return router;
});

describe('Server App (src/server.js)', () => {
    beforeEach(() => {
        process.env.API_TOKEN = 'test-token';
    });

    it('deve aplicar os cabeçalhos de segurança do Helmet (ex: remover x-powered-by)', async () => {
        const res = await request(app).get('/api/test-route');
        expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('deve aplicar os cabeçalhos de Rate Limiting', async () => {
        const res = await request(app).get('/api/test-route');
        expect(res.headers).toHaveProperty('ratelimit-limit');
    });

    it('deve negar acesso às rotas /api caso não envie token', async () => {
        const res = await request(app).get('/api/test-route');
        expect(res.status).toBe(401);
    });

    it('deve permitir acesso às rotas /api quando enviado token válido', async () => {
        const res = await request(app)
            .get('/api/test-route')
            .set('Authorization', 'Bearer test-token');
            
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
    });
});