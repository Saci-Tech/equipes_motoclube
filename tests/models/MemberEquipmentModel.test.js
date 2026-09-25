const MemberEquipmentModel = require('../../src/models/MemberEquipmentModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/memberEquipmentModel.mock');

jest.mock('../../src/config/database');

describe('MemberEquipmentModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new MemberEquipmentModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('integrante_equipamento');
        expect(model.primaryKey).toBe('id');
    });

    describe('findActiveByEquipment', () => {
        test('retorna null se o id do equipamento não for fornecido', async () => {
            const result = await model.findActiveByEquipment(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o empréstimo ativo se o equipamento estiver com alguém', async () => {
            db.query.mockResolvedValueOnce([[mocks.activeAssignment]]);
            const result = await model.findActiveByEquipment(5);
            
            expect(result).toEqual(mocks.activeAssignment);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('data_devolucao IS NULL'), 
                [5]
            );
        });

        test('retorna null se o equipamento não possuir empréstimo ativo', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findActiveByEquipment(99);
            
            expect(result).toBeNull();
        });
    });

    describe('findByMember', () => {
        test('retorna null se o id do integrante não for fornecido', async () => {
            const result = await model.findByMember(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o histórico de equipamentos do integrante com os nomes anexados', async () => {
            db.query.mockResolvedValueOnce([mocks.memberHistory]);
            const result = await model.findByMember(10);
            
            expect(result).toEqual(mocks.memberHistory);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INNER JOIN equipamentos'), 
                [10]
            );
        });

        test('retorna array vazio se o integrante não tiver histórico de equipamentos', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByMember(99);
            
            expect(result).toEqual([]);
        });
    });
});