const db = require('../../src/config/database');
const BaseModel = require('../../src/models/BaseModel');

jest.mock('../../src/config/database', () => {
    const mockQuery = jest.fn();
    return {
        promise: () => ({ query: mockQuery }),
        _mockQuery: mockQuery
    };
});

describe('BaseModel (Classe Base)', () => {
    let model;
    let mockQuery;

    beforeEach(() => {
        jest.clearAllMocks();
        mockQuery = db._mockQuery;
        model = new BaseModel('tabela_teste');
    });

    describe('Construtor e Inicialização', () => {
        it('deve definir a chave primária padrão como "id"', () => {
            expect(model.tableName).toBe('tabela_teste');
            expect(model.primaryKey).toBe('id');
        });

        it('deve aceitar uma chave primária personalizada', () => {
            const customModel = new BaseModel('tabela_teste', 'codigo');
            expect(customModel.primaryKey).toBe('codigo');
        });
    });

    describe('Serialização e Deserialização', () => {
        it('deve retornar objeto vazio ao serializar payload nulo/undefined', () => {
            expect(model.serialize(null)).toEqual({});
            expect(model.serialize(undefined)).toEqual({});
        });

        it('deve retornar o próprio objeto ao serializar payload válido', () => {
            const payload = { nome: 'Teste' };
            expect(model.serialize(payload)).toEqual(payload);
        });

        it('deve retornar null ao deserializar linha nula/undefined', () => {
            expect(model.deserialize(null)).toBeNull();
            expect(model.deserialize(undefined)).toBeNull();
        });

        it('deve retornar o próprio objeto ao deserializar linha válida', () => {
            const row = { id: 1, nome: 'Teste' };
            expect(model.deserialize(row)).toEqual(row);
        });

        it('deve tratar deserializeList corretamente', () => {
            expect(model.deserializeList(null)).toEqual([]);
            expect(model.deserializeList('invalido')).toEqual([]);
            expect(model.deserializeList([{ id: 1 }, { id: 2 }])).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });

    describe('Métodos de Consulta (findAll, findById)', () => {
        it('findAll deve retornar lista de registros', async () => {
            const fakeRows = [{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }];
            mockQuery.mockResolvedValueOnce([fakeRows]);

            const result = await model.findAll();

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tabela_teste');
            expect(result).toEqual(fakeRows);
        });

        it('findById deve retornar o registro quando encontrado', async () => {
            const fakeRow = { id: 10, nome: 'Item Encontrado' };
            mockQuery.mockResolvedValueOnce([[fakeRow]]);

            const result = await model.findById(10);

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tabela_teste WHERE id = ?', [10]);
            expect(result).toEqual(fakeRow);
        });

        it('findById deve retornar null quando o registro não existir', async () => {
            mockQuery.mockResolvedValueOnce([[]]);

            const result = await model.findById(999);

            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM tabela_teste WHERE id = ?', [999]);
            expect(result).toBeNull();
        });
    });

    describe('Método create', () => {
        it('deve inserir um novo registro e retornar o insertId', async () => {
            mockQuery.mockResolvedValueOnce([{ insertId: 42 }]);

            const insertId = await model.create({ nome: 'Novo Item', valor: 100 });

            expect(mockQuery).toHaveBeenCalledWith(
                'INSERT INTO tabela_teste (nome, valor) VALUES (?, ?)',
                ['Novo Item', 100]
            );
            expect(insertId).toBe(42);
        });

        it('deve lançar erro se o payload serializado for vazio', async () => {
            jest.spyOn(model, 'serialize').mockReturnValue({});

            await expect(model.create({})).rejects.toThrow('Nenhum dado válido fornecido para inserção.');
        });
    });

    describe('Método update', () => {
        it('deve atualizar o registro e retornar true se afetar linhas', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await model.update(1, { nome: 'Nome Atualizado' });

            expect(mockQuery).toHaveBeenCalledWith(
                'UPDATE tabela_teste SET nome = ? WHERE id = ?',
                ['Nome Atualizado', 1]
            );
            expect(success).toBe(true);
        });

        it('deve retornar false se nenhuma linha for afetada na atualização', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const success = await model.update(999, { nome: 'Inexistente' });

            expect(success).toBe(false);
        });

        it('deve retornar false imediatamente se o payload serializado for vazio', async () => {
            jest.spyOn(model, 'serialize').mockReturnValue({});

            const success = await model.update(1, {});

            expect(mockQuery).not.toHaveBeenCalled();
            expect(success).toBe(false);
        });
    });

    describe('Método delete', () => {
        it('deve deletar o registro e retornar true se afetar linhas', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const success = await model.delete(5);

            expect(mockQuery).toHaveBeenCalledWith('DELETE FROM tabela_teste WHERE id = ?', [5]);
            expect(success).toBe(true);
        });

        it('deve retornar false se tentar deletar id inexistente', async () => {
            mockQuery.mockResolvedValueOnce([{ affectedRows: 0 }]);

            const success = await model.delete(999);

            expect(success).toBe(false);
        });
    });
});