const bcrypt = require('bcrypt');
const User = require('./user.model');

const userService = {
    create: async (userData) => {
        userData.password = await bcrypt.hash(userData.password, 10);
        return await User.create(userData);
    },

    findById: async (id) => {
        return await User.findByPk(id, { attributes: { exclude: ['password'] } });
    },

    findByEmail: async (email) => {
        return await User.findOne({ where: { email } });
    },

    findAll: async () => {
        return await User.findAll({ attributes: { exclude: ['password'] } });
    },

    update: async (id, data) => {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Usuário não encontrado');
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        await user.update(data);
        const { password, ...safeUser } = user.toJSON();
        return safeUser;
    },

    setActive: async (id, active) => {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Usuário não encontrado');
        await user.update({ active });
        return { id: user.id, active: user.active };
    },
};

module.exports = userService;
