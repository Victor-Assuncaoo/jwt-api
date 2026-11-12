const categoryService = require('./category.service');
const categoryController = {
    createCategory: async (req, res) => {
        try {
            const category = await categoryService.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const category = await categoryService.update(req.params.id, req.body);
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const category = await categoryService.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryService.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await categoryService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = categoryController;