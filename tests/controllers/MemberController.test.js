// =========================================================================
// TESTE UNITÁRIO: MemberController.test.js
// =========================================================================

const memberController = require('../../src/controllers/MemberController');
const memberModel = require('../../src/models/MemberModel');
const {
    apiPayloadMock,
    deserializedMemberMock,
    deserializedMemberListMock
} = require('../mocks/Member.mock');

jest.mock('../../src/models/MemberModel');

describe('MemberController (Controller de Integrantes)', () => {
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

    describe('getAll', () => {
        it('deve retornar lista de integrantes com status 200', async () => {
            memberModel.findAll.mockResolvedValueOnce(deserializedMemberListMock);

            await memberController.getAll(req, res);

            expect(memberModel.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedMemberListMock
            });
        });

        it('deve retornar status 500 se o model lançar exceção', async () => {
            memberModel.findAll.mockRejectedValueOnce(new Error('Database error'));

            await memberController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: 'Database error'
            });
        });
    });

    describe('getById', () => {
        it('deve retornar integrante com status 200 quando encontrado', async () => {
            req.params.id = '1';
            memberModel.findById.mockResolvedValueOnce(deserializedMemberMock);

            await memberController.getById(req, res);

            expect(memberModel.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedMemberMock
            });
        });

        it('deve retornar status 404 quando o integrante não existir', async () => {
            req.params.id = '999';
            memberModel.findById.mockResolvedValueOnce(null);

            await memberController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Member not found'
            });
        });

        it('deve retornar status 500 em caso de erro no banco', async () => {
            req.params.id = '1';
            memberModel.findById.mockRejectedValueOnce(new Error('Connection failed'));

            await memberController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create', () => {
        it('deve criar novo integrante e retornar 201 com os dados criados', async () => {
            req.body = apiPayloadMock;
            memberModel.create.mockResolvedValueOnce(1);
            memberModel.findById.mockResolvedValueOnce(deserializedMemberMock);

            await memberController.create(req, res);

            expect(memberModel.create).toHaveBeenCalledWith(apiPayloadMock);
            expect(memberModel.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedMemberMock
            });
        });

        it('deve retornar status 400 se faltarem campos obrigatórios (fullName ou cpf)', async () => {
            req.body = { shirtName: 'Apenas Apelido' };

            await memberController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing required fields: fullName and cpf are required'
            });
        });

        it('deve retornar status 500 em caso de erro', async () => {
            req.body = apiPayloadMock;
            memberModel.create.mockRejectedValueOnce(new Error('Duplicate key'));

            await memberController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update', () => {
        it('deve atualizar o integrante e retornar 200', async () => {
            req.params.id = '1';
            req.body = { shirtName: 'Novo Apelido' };
            memberModel.update.mockResolvedValueOnce(true);
            memberModel.findById.mockResolvedValueOnce({ ...deserializedMemberMock, shirtName: 'Novo Apelido' });

            await memberController.update(req, res);

            expect(memberModel.update).toHaveBeenCalledWith('1', { shirtName: 'Novo Apelido' });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 404 se a atualização falhar ou não encontrar o registro', async () => {
            req.params.id = '999';
            req.body = { shirtName: 'Novo Apelido' };
            memberModel.update.mockResolvedValueOnce(false);

            await memberController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Member not found or no changes made'
            });
        });

        it('deve retornar status 500 em caso de erro no update', async () => {
            req.params.id = '1';
            memberModel.update.mockRejectedValueOnce(new Error('Fatal error'));

            await memberController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('delete', () => {
        it('deve deletar o integrante e retornar 200', async () => {
            req.params.id = '1';
            memberModel.delete.mockResolvedValueOnce(true);

            await memberController.delete(req, res);

            expect(memberModel.delete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Member deleted successfully'
            });
        });

        it('deve retornar status 404 se tentar deletar ID inexistente', async () => {
            req.params.id = '999';
            memberModel.delete.mockResolvedValueOnce(false);

            await memberController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar status 500 em caso de falha', async () => {
            req.params.id = '1';
            memberModel.delete.mockRejectedValueOnce(new Error('FK constraint error'));

            await memberController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByCpf', () => {
        it('deve retornar integrante pelo CPF com status 200', async () => {
            req.params.cpf = '12345678901';
            memberModel.findByCpf.mockResolvedValueOnce(deserializedMemberMock);

            await memberController.getByCpf(req, res);

            expect(memberModel.findByCpf).toHaveBeenCalledWith('12345678901');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 404 quando CPF não for encontrado', async () => {
            req.params.cpf = '00000000000';
            memberModel.findByCpf.mockResolvedValueOnce(null);

            await memberController.getByCpf(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 500 se o model falhar', async () => {
            req.params.cpf = '12345678901';
            memberModel.findByCpf.mockRejectedValueOnce(new Error('Timeout'));

            await memberController.getByCpf(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByQrKey', () => {
        it('deve retornar integrante por QR Code com status 200', async () => {
            req.params.qrKey = 'UUID-QR-123';
            memberModel.findByQrKey.mockResolvedValueOnce(deserializedMemberMock);

            await memberController.getByQrKey(req, res);

            expect(memberModel.findByQrKey).toHaveBeenCalledWith('UUID-QR-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar 404 quando chave QR não existir', async () => {
            req.params.qrKey = 'INVALID';
            memberModel.findByQrKey.mockResolvedValueOnce(null);

            await memberController.getByQrKey(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar 500 se houver erro', async () => {
            req.params.qrKey = 'UUID-QR-123';
            memberModel.findByQrKey.mockRejectedValueOnce(new Error('Timeout'));

            await memberController.getByQrKey(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByTeamId', () => {
        it('deve retornar lista de integrantes da equipe com status 200', async () => {
            req.params.teamId = '10';
            memberModel.findByTeamId.mockResolvedValueOnce(deserializedMemberListMock);

            await memberController.getByTeamId(req, res);

            expect(memberModel.findByTeamId).toHaveBeenCalledWith('10');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedMemberListMock
            });
        });

        it('deve retornar 500 em caso de erro', async () => {
            req.params.teamId = '10';
            memberModel.findByTeamId.mockRejectedValueOnce(new Error('Database error'));

            await memberController.getByTeamId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});