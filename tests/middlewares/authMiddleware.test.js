// =========================================================================
// TESTE UNITÁRIO: authMiddleware.test.js
// =========================================================================

const authMiddleware = require('../../src/middlewares/authMiddleware');

describe('Auth Middleware (authMiddleware.js)', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.API_TOKEN = 'test-secret-token';
    });

    it('deve retornar status 401 se o cabeçalho Authorization não for informado', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticação não fornecido.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar status 401 se o cabeçalho não usar o prefixo Bearer', () => {
        req.headers.authorization = 'Basic token123';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Formato de token inválido. Use: Bearer <token>' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar status 403 se o token fornecido for incorreto', () => {
        req.headers.authorization = 'Bearer token-errado';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou não autorizado.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se o token Bearer for válido', () => {
        req.headers.authorization = 'Bearer test-secret-token';

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve utilizar o token padrão "secret-token" quando process.env.API_TOKEN não estiver definido', () => {
    delete process.env.API_TOKEN;
        req.headers.authorization = 'Bearer secret-token';

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});