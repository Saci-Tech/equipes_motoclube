const EquipmentModel = require('../../src/models/EquipmentModel');
const db = require('../../src/config/database');
const mocks = require('../mocks/equipmentModel.mock');

jest.mock('../../src/config/database');

describe('EquipmentModel Unit Tests - 100% Coverage', () => {
    let model;

    beforeEach(() => {
        jest.clearAllMocks();
        model = new EquipmentModel();
    });

    test('constructor inicializa corretamente o nome da tabela e chave primária', () => {
        expect(model.tableName).toBe('equipamentos');
        expect(model.primaryKey).toBe('id');
    });

    describe('findByName', () => {
        test('retorna null se o nome não for fornecido', async () => {
            const result = await model.findByName(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna o equipamento se o nome for encontrado', async () => {
            db.query.mockResolvedValueOnce([[mocks.validEquipment]]);
            const result = await model.findByName('Rádio Comunicador HT');
            
            expect(result).toEqual(mocks.validEquipment);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM'), 
                ['Rádio Comunicador HT']
            );
        });

        test('retorna null se o equipamento não for encontrado', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findByName('Inexistente');
            
            expect(result).toBeNull();
        });
    });

    describe('findWithMembers', () => {
        test('retorna null se o id do equipamento não for informado', async () => {
            const result = await model.findWithMembers(null);
            expect(result).toBeNull();
            expect(db.query).not.toHaveBeenCalled();
        });

        test('retorna null se a consulta retornar vazia (equipamento não existe)', async () => {
            db.query.mockResolvedValueOnce([[]]);
            const result = await model.findWithMembers(99);
            expect(result).toBeNull();
        });

        test('retorna equipamento com a lista de atribuições populada', async () => {
            db.query.mockResolvedValueOnce([mocks.validEquipmentWithMembersRaw]);
            const result = await model.findWithMembers(1);
            expect(result).toEqual(mocks.validEquipmentWithMembersResult);
        });

        test('retorna equipamento com lista de atribuições vazia caso não tenha histórico', async () => {
            db.query.mockResolvedValueOnce([mocks.validEquipmentWithoutMembersRaw]);
            const result = await model.findWithMembers(2);
            expect(result).toEqual(mocks.validEquipmentWithoutMembersResult);
        });
    });
});