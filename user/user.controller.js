const userService = require('./user.service');

const userController = {
    create: async (req, res) => {
        try {
            const user = await userService.create(req.body);
            const { password, ...safeUser } = user.toJSON();
            res.status(201).json(safeUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const user = await userService.findById(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    findAll: async (req, res) => {
        try {
            const users = await userService.findAll();
            res.json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const user = await userService.update(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    setActive: async (req, res) => {
        try {
            const { active } = req.body;
            const result = await userService.setActive(req.params.id, active);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = userController;
