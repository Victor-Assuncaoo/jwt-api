const Reader = require('./reader.model');
const Loan = require('../loan/loan.model');
const Book = require('../book/book.model');

const readerService = {
    create: async (data) => {
        const existing = await Reader.findOne({ where: { cpf: data.cpf } });
        if (existing) {
            const err = new Error('CPF já cadastrado');
            err.status = 409;
            throw err;
        }
        return await Reader.create(data);
    },

    findAll: async () => {
        return await Reader.findAll();
    },

    findById: async (id) => {
        return await Reader.findByPk(id);
    },

    update: async (id, data) => {
        const reader = await Reader.findByPk(id);
        if (!reader) throw new Error('Leitor não encontrado');
        await reader.update(data);
        return reader;
    },

    getLoanHistory: async (readerId) => {
        return await Loan.findAll({
            where: { readerId },
            include: [{ model: Book, attributes: ['id', 'title', 'isbn'] }],
            order: [['createdAt', 'DESC']],
        });
    },
};

module.exports = readerService;
