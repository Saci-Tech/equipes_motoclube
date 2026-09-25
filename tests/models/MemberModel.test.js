const MemberModel = require('../../src/models/MemberModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/memberModel.mock'); // <-- Caminho corrigido aqui!

jest.mock('../../src/config/database');

describe('MemberModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new MemberModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('members');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByEmail', () => {
        test('retorna null se o email não for fornecido', async () => {
            const result = await model.findByEmail(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o membro se o email for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validMember]]);
            const result = await model.findByEmail('joao@example.com');
            
            expect(result).toEqual(mocks.validMember);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM'), 
                ['joao@example.com']
            );
        });

        test('retorna null se o email não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByEmail('inexistente@example.com');
            
            expect(result).toBeNull();
        });
    });

    describe('findByCpf', () => {
        test('retorna null se o CPF não for fornecido', async () => {
            const result = await model.findByCpf(undefined);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o membro se o CPF for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validMember]]);
            const result = await model.findByCpf('12345678900');
            
            expect(result).toEqual(mocks.validMember);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM'), 
                ['12345678900']
            );
        });

        test('retorna null se o CPF não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByCpf('00000000000');
            expect(result).toBeNull();
        });
    });

    describe('findWithTeams', () => {
        test('retorna null se o id do membro não for informado', async () => {
            const result = await model.findWithTeams(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna null se a consulta retornar vazia (membro não existe)', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findWithTeams(99);
            expect(result).toBeNull();
        });

        test('retorna membro com a lista de times populada', async () => {
            db.query.mockResolvedValueOnce([mocks.validMemberWithTeamsRaw]);
            const result = await model.findWithTeams(1);
            expect(result).toEqual(mocks.validMemberWithTeamsResult);
        });

        test('retorna membro com lista de times vazia caso não pertença a nenhum', async () => {
            db.query.mockResolvedValueOnce([mocks.validMemberWithoutTeamsRaw]);
            const result = await model.findWithTeams(2);
            expect(result).toEqual(mocks.validMemberWithoutTeamsResult);
        });
    });
});