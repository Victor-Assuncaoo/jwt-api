const Category = require('./category.model');
const Book = require('../book/book.model');

const categoryService = {
    create: async (data) => {
        const existing = await Category.findOne({ where: { name: data.name } });
        if (existing) {
            const err = new Error('Categoria já existe com esse nome');
            err.status = 409;
            throw err;
        }
        return await Category.create(data);
    },

    findAll: async () => {
        return await Category.findAll();
    },

    findById: async (id) => {
        return await Category.findByPk(id);
    },

    update: async (id, data) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error('Categoria não encontrada');
        await category.update(data);
        return category;
    },

    delete: async (id) => {
        const category = await Category.findByPk(id);
        if (!category) throw new Error('Categoria não encontrada');
        const bookCount = await Book.count({ where: { CategoryId: id } });
        if (bookCount > 0) {
            const err = new Error('Não é possível excluir categoria com livros vinculados');
            err.status = 409;
            throw err;
        }
        await category.destroy();
    },
};

module.exports = categoryService;
