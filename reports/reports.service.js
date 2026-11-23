const Book = require('../book/book.model');
const Loan = require('../loan/loan.model');
const Reader = require('../reader/reader.model');
const { Op } = require('sequelize');
const db = require('../config/db');

const reportsService = {
    dashboard: async () => {
        const today = new Date().toISOString().split('T')[0];

        const totalBooks = await Book.sum('totalCopies') || 0;
        const totalAvailable = await Book.sum('availableCopies') || 0;
        const totalBorrowed = totalBooks - totalAvailable;

        const overdueLoans = await Loan.count({
            where: {
                status: 'ATIVO',
                dueDate: { [Op.lt]: today },
            },
        });

        const totalFines = await Loan.sum('fine') || 0;
        const totalReaders = await Reader.count();
        const totalActiveLoans = await Loan.count({ where: { status: 'ATIVO' } });

        return {
            totalBooks,
            totalAvailable,
            totalBorrowed,
            totalActiveLoans,
            overdueLoans,
            totalFines,
            totalReaders,
        };
    },
};

module.exports = reportsService;
