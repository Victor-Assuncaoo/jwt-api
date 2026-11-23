const loanService = require('./loan.service');

const loanController = {
    create: async (req, res) => {
        try {
            const loan = await loanService.create(req.body, req.user.id);
            res.status(201).json(loan);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    return: async (req, res) => {
        try {
            const loan = await loanService.return(req.params.id);
            res.json(loan);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    findAll: async (req, res) => {
        try {
            const loans = await loanService.findAll(req.query);
            res.json(loans);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = loanController;
