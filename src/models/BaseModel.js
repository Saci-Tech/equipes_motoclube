const db = require('../config/database');

class BaseModel {
    /**
     * @param {string} tableName - Nome exato da tabela no MySQL
     * @param {string} primaryKey - Chave primária da tabela (default: 'id')
     */
    constructor(tableName, primaryKey = 'id') {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }

    /**
     * Converte o payload da API (camelCase / EN) para a estrutura da tabela (snake_case / PT).
     * Sobrescreva este método na classe filha para fazer o de/para específico.
     */
    serialize(payload) {
        if (!payload) return {};
        return { ...payload };
    }

    /**
     * Converte a linha vinda do banco (snake_case / PT) para o formato da API (camelCase / EN).
     * Sobrescreva este método na classe filha para fazer o de/para específico.
     */
    deserialize(row) {
        if (!row) return null;
        return { ...row };
    }

    /**
     * Converte um array de registros do banco
     */
    deserializeList(rows) {
        if (!Array.isArray(rows)) return [];
        return rows.map((row) => this.deserialize(row));
    }

    /**
     * Retorna todos os registros da tabela
     */
    async findAll() {
        const [rows] = await db.promise().query(`SELECT * FROM ${this.tableName}`);
        return this.deserializeList(rows);
    }

    /**
     * Busca um registro por ID
     */
    async findById(id) {
        const [rows] = await db.promise().query(
            `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
            [id]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    /**
     * Insere um novo registro a partir de um objeto serializado
     */
    async create(payload) {
        const data = this.serialize(payload);
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) {
            throw new Error('Nenhum dado válido fornecido para inserção.');
        }

        const columns = keys.join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

        const [result] = await db.promise().query(sql, values);
        return result.insertId;
    }

    /**
     * Atualiza um registro existente
     */
    async update(id, payload) {
        const data = this.serialize(payload);
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) return false;

        const setClause = keys.map((key) => `${key} = ?`).join(', ');
        const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;

        const [result] = await db.promise().query(sql, [...values, id]);
        return result.affectedRows > 0;
    }

    /**
     * Remove um registro por ID
     */
    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
        const [result] = await db.promise().query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = BaseModel;