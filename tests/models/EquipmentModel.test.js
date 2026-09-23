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
                name: 'Rádio HT Baofeng',
                category: 'COMUNICACAO',
                serialNumber: 'HT-998822',
                status: 'DISPONIVEL',
                notes: 'Bateria nova, acompanha carregador'
            });
        });

        it('deve retornar null se passar valor nulo/undefined no deserialize', () => {
            expect(equipmentModel.deserialize(null)).toBeNull();
            expect(equipmentModel.deserialize(undefined)).toBeNull();
        });

        it('deve converter payload da API (camelCase) para colunas do banco (snake_case)', () => {
            const result = equipmentModel.serialize(apiPayloadMock);
            expect(result).toEqual({
                nome: 'Rádio HT Baofeng',
                categoria: 'COMUNICACAO',
                numero_serie: 'HT-998822',
                status: 'DISPONIVEL',
                observacoes: 'Bateria nova, acompanha carregador'
            });
        });

        it('deve serializar apenas campos definidos no payload (parcial)', () => {
            const result = equipmentModel.serialize({ serialNumber: 'SN-12345', status: 'MANUTENCAO' });
            expect(result).toEqual({
                numero_serie: 'SN-12345',
                status: 'MANUTENCAO'
            });
        });

        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(equipmentModel.serialize(null)).toEqual({});
            expect(equipmentModel.serialize(undefined)).toEqual({});
        });
    });

    describe('Consultas específicas (findBySerialNumber, findByCategory, findByStatus)', () => {
        it('findBySerialNumber deve retornar equipamento quando encontrado', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await equipmentModel.findBySerialNumber('HT-998822');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE numero_serie = ?',
                ['HT-998822']
            );
            expect(result.serialNumber).toBe('HT-998822');
        });

        it('findBySerialNumber deve retornar null quando não encontrar', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await equipmentModel.findBySerialNumber('INVALIDO');

            expect(result).toBeNull();
        });

        it('findByCategory deve retornar lista filtrada por categoria', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await equipmentModel.findByCategory('COMUNICACAO');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE categoria = ?',
                ['COMUNICACAO']
            );
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(result[0].category).toBe('COMUNICACAO');
        });

        it('findByStatus deve retornar lista filtrada por status', async () => {
            mockQuery.mockResolvedValueOnce([[dbRowMock]]);

            const result = await equipmentModel.findByStatus('DISPONIVEL');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM equipamentos WHERE status = ?',
                ['DISPONIVEL']
            );
            expect(result.length).toBe(1);
            expect(result[0].status).toBe('DISPONIVEL');
        });
    });

    describe('Operações herdadas (create, update, findAll)', () => {
        it('create deve converter camelCase para snake_case ao inserir', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 15 }]);

            const insertId = await equipmentModel.create({
                name: 'Gerador Portátil',
                category: 'ENERGIA'
            });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO equipamentos (nome, categoria) VALUES (?, ?)',
                ['Gerador Portátil', 'ENERGIA']
            );
            expect(insertId).toBe(15);
        });

        it('update deve converter atributos antes de atualizar no banco', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await equipmentModel.update(1, { notes: 'Revisão feita' });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE equipamentos SET observacoes = ? WHERE id = ?',
                ['Revisão feita', 1]
            );
            expect(success).toBe(true);
        });

        it('findAll deve retornar todos os equipamentos convertidos em camelCase', async () => {
            mockQuery.mockResolvedValueOnce([dbRowListMock]);

            const result = await equipmentModel.findAll();

            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty('serialNumber');
            expect(result[0]).not.toHaveProperty('numero_serie');
        });
    });
});