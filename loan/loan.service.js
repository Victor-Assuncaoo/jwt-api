const db = require('../config/db');
const Loan = require('./loan.model');
const Book = require('../book/book.model');
const Reader = require('../reader/reader.model');
const User = require('../user/user.model');
const Author = require('../author/author.model');
const Category = require('../category/category.model');
const { Op } = require('sequelize');

const loanService = {
    create: async (data, attendantId) => {
        const { bookId, readerId } = data;
        return await db.transaction(async (t) => {
            const book = await Book.findByPk(bookId, { transaction: t, lock: true });
            if (!book) throw new Error('Livro não encontrado');
            if (book.availableCopies <= 0) throw new Error('Sem exemplares disponíveis para empréstimo');

            const reader = await Reader.findByPk(readerId, { transaction: t });
            if (!reader) throw new Error('Leitor não encontrado');

            // Checar limite de 3 empréstimos ativos
            const activeCount = await Loan.count({
                where: { readerId, status: 'ATIVO' },
                transaction: t,
            });
            if (activeCount >= 3) {
                throw new Error('Leitor já possui 3 empréstimos ativos');
            }

            // Checar empréstimos atrasados
            const today = new Date().toISOString().split('T')[0];
            const overdueCount = await Loan.count({
                where: {
                    readerId,
                    status: 'ATIVO',
                    dueDate: { [Op.lt]: today },
                },
                transaction: t,
            });
            if (overdueCount > 0) {
                throw new Error('Leitor possui empréstimos atrasados e não pode fazer novos empréstimos');
            }

            const loanDate = today;
            const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0];

            const loan = await Loan.create(
                { bookId, readerId, userId: attendantId, loanDate, dueDate, status: 'ATIVO', fine: 0 },
                { transaction: t }
            );

            await book.update({ availableCopies: book.availableCopies - 1 }, { transaction: t });

            return await Loan.findByPk(loan.id, {
                include: [
                    { model: Book, attributes: ['id', 'title', 'isbn'] },
                    { model: Reader, attributes: ['id', 'name', 'cpf'] },
                    { model: User, attributes: ['id', 'name'] },
                ],
                transaction: t,
            });
        });
    },

    return: async (loanId) => {
        return await db.transaction(async (t) => {
            const loan = await Loan.findByPk(loanId, {
                include: [{ model: Book }],
                transaction: t,
                lock: true,
            });
            if (!loan) throw new Error('Empréstimo não encontrado');
            if (loan.status === 'DEVOLVIDO') throw new Error('Empréstimo já devolvido');

            const today = new Date().toISOString().split('T')[0];
            let fine = 0;
            if (today > loan.dueDate) {
                const msPerDay = 1000 * 60 * 60 * 24;
                const daysLate = Math.ceil(
                    (new Date(today) - new Date(loan.dueDate)) / msPerDay
                );
                fine = daysLate * 1.0;
            }

            await loan.update(
                { returnDate: today, status: 'DEVOLVIDO', fine },
                { transaction: t }
            );

            const book = await Book.findByPk(loan.bookId, { transaction: t, lock: true });
            await book.update({ availableCopies: book.availableCopies + 1 }, { transaction: t });

            return await Loan.findByPk(loanId, {
                include: [
                    { model: Book, attributes: ['id', 'title', 'isbn'] },
                    { model: Reader, attributes: ['id', 'name', 'cpf'] },
                    { model: User, attributes: ['id', 'name'] },
                ],
                transaction: t,
            });
        });
    },

    findAll: async (filters = {}) => {
        const where = {};

        if (filters.status) {
            if (filters.status === 'ATRASADO') {
                // Recalcular status ao listar
                const today = new Date().toISOString().split('T')[0];
                where.status = 'ATIVO';
                where.dueDate = { [Op.lt]: today };
            } else {
                where.status = filters.status;
            }
        }

        return await Loan.findAll({
            where,
            include: [
                { model: Book, attributes: ['id', 'title', 'isbn'] },
                { model: Reader, attributes: ['id', 'name', 'cpf'] },
                { model: User, attributes: ['id', 'name'] },
            ],
            order: [['createdAt', 'DESC']],
        });
    },
};

module.exports = loanService;
