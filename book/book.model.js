const db = require('../config/db');
const { DataTypes } = require('sequelize');
const book = db.define('book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalCopies: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    availableCopies: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = book;