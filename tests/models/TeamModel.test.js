const TeamModel = require('../../src/models/TeamModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/teamModel.mock');

jest.mock('../../src/config/database');

describe('TeamModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new TeamModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('equipes_especiais');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByName', () => {
        test('retorna null se o nome não for fornecido', async () => {
            const result = await model.findByName(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna a equipe se o nome for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validTeam]]);
            const result = await model.findByName('Equipe Alpha');
            
            expect(result).toEqual(mocks.validTeam);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE nome_equipe = ?'), 
                ['Equipe Alpha']
            );
        });

        test('retorna null se a equipe não for encontrada', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByName('Inexistente');
            
            expect(result).toBeNull();
        });
    });

    describe('findWithMembers', () => {
        test('retorna null se o id da equipe não for informado', async () => {
            const result = await model.findWithMembers(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna null se a consulta retornar vazia (equipe não existe)', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findWithMembers(99);
            expect(result).toBeNull();
        });

        test('retorna equipe com a lista de membros populada', async () => {
            db.query.mockResolvedValueOnce([mocks.validTeamWithMembersRaw]);
            const result = await model.findWithMembers(1);
            expect(result).toEqual(mocks.validTeamWithMembersResult);
        });

        test('retorna equipe com lista de membros vazia caso não haja integrantes cadastrados', async () => {
            db.query.mockResolvedValueOnce([mocks.validTeamWithoutMembersRaw]);
            const result = await model.findWithMembers(2);
            expect(result).toEqual(mocks.validTeamWithoutMembersResult);
        });
    });
});