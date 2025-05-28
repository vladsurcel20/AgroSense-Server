const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

const ControlDevice = sequelize.define('ControlDevice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localization: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    greenhouseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastActivity: {
        type: DataTypes.DATE,
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
},{
    tableName: "control_devices",
    timestamps: false,
});

module.exports = ControlDevice;
