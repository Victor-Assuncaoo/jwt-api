const db = require('../config/db');
const { DataTypes } = require('sequelize');

const refreshToken = db.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = refreshToken;