// =========================================================================
// TESTE UNITÁRIO: TeamController.test.js
// =========================================================================

const teamController = require('../../src/controllers/TeamController');
const teamModel = require('../../src/models/TeamModel');
const {
    apiPayloadMock,
    deserializedTeamMock,
    deserializedTeamListMock
} = require('../mocks/Team.mock');

jest.mock('../../src/models/TeamModel');

describe('TeamController (Controller de Equipes)', () => {
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
        it('deve retornar lista de equipes com status 200', async () => {
            teamModel.findAll.mockResolvedValueOnce(deserializedTeamListMock);

            await teamController.getAll(req, res);

            expect(teamModel.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedTeamListMock
            });
        });

        it('deve retornar status 500 se o model falhar', async () => {
            teamModel.findAll.mockRejectedValueOnce(new Error('Database error'));

            await teamController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal server error',
                error: 'Database error'
            });
        });
    });

    describe('getById', () => {
        it('deve retornar a equipe com status 200 quando encontrada', async () => {
            req.params.id = '1';
            teamModel.findById.mockResolvedValueOnce(deserializedTeamMock);

            await teamController.getById(req, res);

            expect(teamModel.findById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedTeamMock
            });
        });

        it('deve retornar status 404 se a equipe não for encontrada', async () => {
            req.params.id = '999';
            teamModel.findById.mockResolvedValueOnce(null);

            await teamController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Team not found'
            });
        });

        it('deve retornar status 500 em caso de erro no banco', async () => {
            req.params.id = '1';
            teamModel.findById.mockRejectedValueOnce(new Error('Query failed'));

            await teamController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('create', () => {
        it('deve criar uma nova equipe e retornar status 201', async () => {
            req.body = apiPayloadMock;
            teamModel.create.mockResolvedValueOnce(1);
            teamModel.findById.mockResolvedValueOnce(deserializedTeamMock);

            await teamController.create(req, res);

            expect(teamModel.create).toHaveBeenCalledWith(apiPayloadMock);
            expect(teamModel.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedTeamMock
            });
        });

        it('deve retornar status 400 se o campo obrigatório "name" não for fornecido', async () => {
            req.body = { category: 'SENIOR' };

            await teamController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Missing required field: name is required'
            });
        });

        it('deve retornar status 500 se o model lançar exceção', async () => {
            req.body = apiPayloadMock;
            teamModel.create.mockRejectedValueOnce(new Error('Insert error'));

            await teamController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('update', () => {
        it('deve atualizar a equipe e retornar status 200', async () => {
            req.params.id = '1';
            req.body = { description: 'Nova Descrição' };
            teamModel.update.mockResolvedValueOnce(true);
            teamModel.findById.mockResolvedValueOnce({ ...deserializedTeamMock, description: 'Nova Descrição' });

            await teamController.update(req, res);

            expect(teamModel.update).toHaveBeenCalledWith('1', { description: 'Nova Descrição' });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 404 se a equipe não existir para atualização', async () => {
            req.params.id = '999';
            req.body = { description: 'Nova Descrição' };
            teamModel.update.mockResolvedValueOnce(false);

            await teamController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Team not found or no changes made'
            });
        });

        it('deve retornar status 500 em caso de erro', async () => {
            req.params.id = '1';
            teamModel.update.mockRejectedValueOnce(new Error('Update error'));

            await teamController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('delete', () => {
        it('deve remover a equipe e retornar status 200', async () => {
            req.params.id = '1';
            teamModel.delete.mockResolvedValueOnce(true);

            await teamController.delete(req, res);

            expect(teamModel.delete).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Team deleted successfully'
            });
        });

        it('deve retornar status 404 se tentar deletar ID inexistente', async () => {
            req.params.id = '999';
            teamModel.delete.mockResolvedValueOnce(false);

            await teamController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar status 500 em caso de erro', async () => {
            req.params.id = '1';
            teamModel.delete.mockRejectedValueOnce(new Error('Delete error'));

            await teamController.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByName', () => {
        it('deve retornar equipe pelo nome com status 200', async () => {
            req.params.name = 'Equipe Alpha';
            teamModel.findByName.mockResolvedValueOnce(deserializedTeamMock);

            await teamController.getByName(req, res);

            expect(teamModel.findByName).toHaveBeenCalledWith('Equipe Alpha');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('deve retornar status 404 quando o nome não for encontrado', async () => {
            req.params.name = 'Inexistente';
            teamModel.findByName.mockResolvedValueOnce(null);

            await teamController.getByName(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('deve retornar status 500 em caso de erro', async () => {
            req.params.name = 'Equipe Alpha';
            teamModel.findByName.mockRejectedValueOnce(new Error('Database error'));

            await teamController.getByName(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getByCategory', () => {
        it('deve retornar lista de equipes por categoria com status 200', async () => {
            req.params.category = 'SENIOR';
            teamModel.findByCategory.mockResolvedValueOnce(deserializedTeamListMock);

            await teamController.getByCategory(req, res);

            expect(teamModel.findByCategory).toHaveBeenCalledWith('SENIOR');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deserializedTeamListMock
            });
        });

        it('deve retornar status 500 se o model falhar', async () => {
            req.params.category = 'SENIOR';
            teamModel.findByCategory.mockRejectedValueOnce(new Error('Query error'));

            await teamController.getByCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});