const { Op } = require('sequelize');
const { Category } = require('./category.model');

const categoryService = {
    create: async (categoryData) => {
        try {
            return await Category.create(categoryData);
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    },
    update: async (id, categoryData) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.update(categoryData);
            return category;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    },
    findById: async (id) => {
        return await Category.findByPk(id);
    },
    findAll: async () => {
        return await Category.findAll();
    },
    delete: async (id) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.destroy();
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
};

module.exports = categoryService;