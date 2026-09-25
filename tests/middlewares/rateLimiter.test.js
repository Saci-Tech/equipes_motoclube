// =========================================================================
// TESTE UNITÁRIO: rateLimiter.test.js
// =========================================================================

const request = require('supertest');
const express = require('express');
const rateLimiter = require('../../src/middlewares/rateLimiter');

const app = express();
app.use(rateLimiter);
app.get('/test-limit', (req, res) => res.status(200).json({ ok: true }));

describe('Rate Limiter Middleware (rateLimiter.js)', () => {
    it('deve permitir requisições dentro do limite estabelecido', async () => {
        const res = await request(app).get('/test-limit');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
    });
});