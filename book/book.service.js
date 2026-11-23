const Book = require('./book.model');
const Author = require('../author/author.model');
const Category = require('../category/category.model');
const Loan = require('../loan/loan.model');
const { Op } = require('sequelize');

const bookService = {
    create: async (data) => {
        const { authorIds, ...bookData } = data;
        // availableCopies defaults to totalCopies when not provided
        if (bookData.availableCopies === undefined) {
            bookData.availableCopies = bookData.totalCopies;
        }
        const book = await Book.create(bookData);
        if (authorIds && authorIds.length > 0) {
            const authors = await Author.findAll({ where: { id: authorIds } });
            await book.setAuthors(authors);
        }
        return await Book.findByPk(book.id, {
            include: [
                { model: Author, attributes: ['id', 'name'] },
                { model: Category, attributes: ['id', 'name'] },
            ],
        });
    },

    findAll: async (filters = {}) => {
        const where = {};
        const include = [
            { model: Author, attributes: ['id', 'name'] },
            { model: Category, attributes: ['id', 'name'] },
        ];

        if (filters.title) {
            where.title = { [Op.like]: `%${filters.title}%` };
        }
        if (filters.categoryId) {
            where.CategoryId = filters.categoryId;
        }
        if (filters.available === 'true') {
            where.availableCopies = { [Op.gt]: 0 };
        }
        if (filters.authorId) {
            include[0] = {
                model: Author,
                attributes: ['id', 'name'],
                where: { id: filters.authorId },
                required: true,
            };
        }

        return await Book.findAll({ where, include });
    },

    findById: async (id) => {
        return await Book.findByPk(id, {
            include: [
                { model: Author, attributes: ['id', 'name'] },
                { model: Category, attributes: ['id', 'name'] },
            ],
        });
    },

    update: async (id, data) => {
        const { authorIds, ...bookData } = data;
        const book = await Book.findByPk(id);
        if (!book) throw new Error('Livro não encontrado');
        await book.update(bookData);
        if (authorIds) {
            const authors = await Author.findAll({ where: { id: authorIds } });
            await book.setAuthors(authors);
        }
        return await Book.findByPk(id, {
            include: [
                { model: Author, attributes: ['id', 'name'] },
                { model: Category, attributes: ['id', 'name'] },
            ],
        });
    },

    delete: async (id) => {
        const book = await Book.findByPk(id);
        if (!book) throw new Error('Livro não encontrado');
        const activeLoans = await Loan.count({ where: { bookId: id, status: 'ATIVO' } });
        if (activeLoans > 0) {
            const err = new Error('Não é possível excluir livro com empréstimos ativos');
            err.status = 409;
            throw err;
        }
        await book.destroy();
    },
};

module.exports = bookService;
