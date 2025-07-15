const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Url = sequelize.define('Url', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    accessCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    tableName: 'urls'
});

module.exports = Url;