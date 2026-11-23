const Author = require('./author.model');
const Book = require('../book/book.model');

const authorService = {
    create: async (data) => {
        return await Author.create(data);
    },

    findAll: async () => {
        return await Author.findAll({ include: [{ model: Book, attributes: ['id', 'title'] }] });
    },

    findById: async (id) => {
        return await Author.findByPk(id, { include: [{ model: Book, attributes: ['id', 'title'] }] });
    },

    update: async (id, data) => {
        const author = await Author.findByPk(id);
        if (!author) throw new Error('Autor não encontrado');
        await author.update(data);
        return author;
    },

    delete: async (id) => {
        const author = await Author.findByPk(id, {
            include: [{ model: Book }],
        });
        if (!author) throw new Error('Autor não encontrado');
        if (author.Books && author.Books.length > 0) {
            const err = new Error('Não é possível excluir autor com livros vinculados');
            err.status = 409;
            throw err;
        }
        await author.destroy();
    },
};

module.exports = authorService;
