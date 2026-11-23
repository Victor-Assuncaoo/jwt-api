const db = require('../config/db');
const { DataTypes } = require('sequelize');

const Loan = db.define('Loan', {
    loanDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    returnDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ATIVO', 'DEVOLVIDO', 'ATRASADO'),
        allowNull: false,
        defaultValue: 'ATIVO',
    },
    fine: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Loan;
