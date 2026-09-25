const MemberTeamModel = require('../../src/models/MemberTeamModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/memberTeamModel.mock');

jest.mock('../../src/config/database');

describe('MemberTeamModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new MemberTeamModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('integrante_por_equipe');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByTeam', () => {
        test('retorna null se o id da equipe não for fornecido', async () => {
            const result = await model.findByTeam(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna a lista de integrantes da equipe com os dados do integrante', async () => {
            db.query.mockResolvedValueOnce([mocks.teamMembers]);
            const result = await model.findByTeam(5);
            
            expect(result).toEqual(mocks.teamMembers);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INNER JOIN integrantes'), 
                [5]
            );
        });

        test('retorna array vazio se a equipe não tiver integrantes', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByTeam(99);
            expect(result).toEqual([]);
        });
    });

    describe('checkMembership', () => {
        test('retorna null se id_integrante ou id_equipe não forem fornecidos', async () => {
            const resultMissingTeam = await model.checkMembership(10, null);
            const resultMissingMember = await model.checkMembership(null, 5);
            
            expect(resultMissingTeam).toBeNull();
            expect(resultMissingMember).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o registro se o integrante pertencer à equipe', async () => {
            db.query.mockResolvedValueOnce([[mocks.membershipRecord]]);
            const result = await model.checkMembership(10, 5);
            
            expect(result).toEqual(mocks.membershipRecord);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE id_integrante = ? AND id_equipe = ?'), 
                [10, 5]
            );
        });

        test('retorna null se o integrante não pertencer à equipe', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.checkMembership(99, 99);
            expect(result).toBeNull();
        });
    });
});