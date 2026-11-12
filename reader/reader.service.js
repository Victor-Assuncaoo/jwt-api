const { Op } = require('sequelize');
const {Reader, Loan, Book } = require('./user.model');


const readerService = {
    create: async (readerData) => {
        try {
            readerData.password = await bcrypt.hash(readerData.password, 10);
            return await Reader.create(readerData);
        } catch (error) {
            throw new Error('Error creating reader: ' + error.message);
        }
    },
    update: async (id, readerData) => {
        try {
            const reader = await Reader.findByPk(id);
            if (!reader) {
                throw new Error('Reader not found');
            }
            await reader.update(readerData);
            return reader;
        } catch (error) {
            throw new Error('Error updating reader: ' + error.message);
        }
    },
    findById: async (id) => {
        return await Reader.findByPk(id);
    },
    findByEmail: async (email) => {
        return await Reader.findOne({ where: { email } });
    },
    findAll: async () => {
        return await Reader.findAll();
    },
    delete: async (id) => {
        try {
            const reader = await Reader.findByPk(id);
            if (!reader) {
                throw new Error('Reader not found');
            }
            await reader.destroy();
        } catch (error) {
            throw new Error('Error deleting reader: ' + error.message);
        }
}

};

module.exports = readerService;