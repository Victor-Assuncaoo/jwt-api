const reportsService = require('./reports.service');

const reportsController = {
    dashboard: async (req, res) => {
        try {
            const data = await reportsService.dashboard();
            res.json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = reportsController;
