const db = require('../config/database');

class BaseModel {
    /**
     * @param {string} tableName - Nome exato da tabela no MySQL
     * @param {string|null} [primaryKey='id'] - Chave primária da tabela
     */
    constructor(tableName, primaryKey = 'id') {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
    }

    serialize(payload) {
        if (!payload) return null;
        if (Array.isArray(payload)) {
            return payload.map((item) => ({ ...item }));
        }
        return { ...payload };
    }

    deserialize(row) {
        if (!row) return null;
        if (Array.isArray(row)) {
            return row.map((item) => ({ ...item }));
        }
        return { ...row };
    }

    async getRecords() {
        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName}`
        );
        return rows.length > 0 ? this.deserialize(rows) : null;
    }

    async getRecordById(id) {
        if (!this.primaryKey) {
            throw new Error('Chave primária não definida para esta tabela.');
        }
        const [rows] = await db.query(
            `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`,
            [id]
        );
        return rows.length > 0 ? this.deserialize(rows[0]) : null;
    }

    async findAll(filters = {}) {
        const keys = Object.keys(filters);
        let sql = `SELECT * FROM ${this.tableName}`;
        const values = [];

        if (keys.length > 0) {
            const conditions = keys.map((key) => `${key} = ?`).join(' AND ');
            sql += ` WHERE ${conditions}`;
            values.push(...Object.values(filters));
        }

        const [rows] = await db.query(sql, values);
        return this.deserialize(rows);
    }

    async create(payload) {
        if (!payload) throw new Error('Payload é obrigatório para criação.');
        const isArray = Array.isArray(payload);
        const items = isArray ? payload : [payload];
        const createdRecords = [];

        for (const item of items) {
            const serialized = this.serialize(item);
            const keys = Object.keys(serialized);
            const values = Object.values(serialized);

            if (keys.length === 0) {
                throw new Error('Nenhum dado válido fornecido para inserção.');
            }

            const columns = keys.join(', ');
            const placeholders = keys.map(() => '?').join(', ');
            const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

            const [result] = await db.query(sql, values);
            const insertId = (this.primaryKey ? serialized[this.primaryKey] : null) || result?.insertId;

            if (this.primaryKey && insertId) {
                const created = await this.getRecordById(insertId);
                createdRecords.push(created);
            } else {
                createdRecords.push(this.deserialize(serialized));
            }
        }

        return isArray ? createdRecords : createdRecords[0];
    }

    async update(payload) {
        if (!payload) throw new Error('Payload é obrigatório para atualização.');
        const isArray = Array.isArray(payload);
        const items = isArray ? payload : [payload];
        const updatedRecords = [];

        for (const item of items) {
            const serialized = this.serialize(item);
            const recordId = item.id || (this.primaryKey ? serialized[this.primaryKey] : null);

            if (this.primaryKey && !recordId) {
                throw new Error(`Identificador '${this.primaryKey}' é obrigatório no payload.`);
            }

            if (this.primaryKey) {
                delete serialized[this.primaryKey];
                delete serialized.id;
            }

            const keys = Object.keys(serialized);
            const values = Object.values(serialized);

            if (this.primaryKey && keys.length > 0) {
                const setClause = keys.map((key) => `${key} = ?`).join(', ');
                const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;
                await db.query(sql, [...values, recordId]);
            }

            const updated = this.primaryKey ? await this.getRecordById(recordId) : this.deserialize(item);
            updatedRecords.push(updated);
        }

        return isArray ? updatedRecords : updatedRecords[0];
    }

    async delete(payload) {
        if (!payload) throw new Error('Payload é obrigatório para remoção.');
        const isArray = Array.isArray(payload);
        const items = isArray ? payload : [payload];
        const deletedRecords = [];

        for (const item of items) {
            const id = typeof item === 'object' ? item.id || (this.primaryKey ? item[this.primaryKey] : null) : item;
            if (!id && this.primaryKey) {
                throw new Error('Identificador da exclusão não fornecido.');
            }

            const record = this.primaryKey && id ? await this.getRecordById(id) : null;
            if (this.primaryKey && id) {
                const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
                await db.query(sql, [id]);
            }
            deletedRecords.push(record || (typeof item === 'object' ? item : { id }));
        }

        return isArray ? deletedRecords : deletedRecords[0];
    }
}

module.exports = BaseModel;