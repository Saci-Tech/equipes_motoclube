// =========================================================================
// TESTE UNITÁRIO: EquipmentModel.test.js
// =========================================================================

const db = require('../../src/config/database');
const equipmentModel = require('../../src/models/EquipmentModel');
const { dbRowMock, dbRowListMock, apiPayloadMock } = require('../mocks/Equipment.mock');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({
            query: mockQuery
        }),
        _mockQuery: mockQuery
    };
});

describe('EquipmentModel (Modelo de Equipamentos)', () => {
    let mockQuery;

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
    });

    describe('Serialização e Deserialização', () => {
        it('deve converter linha do banco (snake_case) para camelCase', () => {
            const result = equipmentModel.deserialize(dbRowMock);
            expect(result).toEqual({
                id: 1,
                name: 'Rádio HT Motorola',
                category: 'COMUNICACAO',
                serialNumber: 'HT123456',
                status: 'DISPONIVEL',
                notes: 'Em perfeito estado'
            });
        });

        it('deve retornar null se passar valor nulo/undefined no deserialize', () => {
            expect(equipmentModel.deserialize(null)).toBeNull();
            expect(equipmentModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = equipmentModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome: 'Rádio HT Motorola',
                categoria: 'COMUNICACAO',
                numero_serie: 'HT123456',
                status: 'DISPONIVEL',
                observacoes: 'Em perfeito estado'
            });
        });

        it('deve serializar apenas campos definidos no payload (parcial)', () => {
            const result = equipmentModel.serialize({ name: 'Novo Nome' });
            expect(result).toEqual({ nome: 'Novo Nome' });
        });

        it('deve retornar objeto vazio ao tentar serializar null ou undefined', () => {
            expect(equipmentModel.serialize(null)).toEqual({});
            expect(equipmentModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findBySerialNumber, findByCategory, findByStatus)', () => {
        it('findBySerialNumber deve retornar equipamento quando encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await equipmentModel.findBySerialNumber('HT123456');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE numero_serie = ?',
                ['HT123456']
            );
            expect(result.serialNumber).toBe('HT123456');
        });

        it('findBySerialNumber deve retornar null quando não encontrar', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await equipmentModel.findBySerialNumber('INVALIDO');

            expect(result).toBeNull();
        });

        it('findByCategory deve retornar lista de equipamentos filtrados por categoria', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await equipmentModel.findByCategory('COMUNICACAO');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE categoria = ?',
                ['COMUNICACAO']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        it('findByStatus deve retornar lista de equipamentos filtrados por status', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await equipmentModel.findByStatus('DISPONIVEL');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE status = ?',
                ['DISPONIVEL']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
    });

    it('deve serializar apenas campos definidos no payload sem a propriedade name', () => {
        const result = equipmentModel.serialize({
            category: 'COMUNICACAO',
            serialNumber: 'HT123456'
        });

        expect(result).toEqual({
            categoria: 'COMUNICACAO',
            numero_serie: 'HT123456'
        });
        expect(result).not.toHaveProperty('nome');
    });
});