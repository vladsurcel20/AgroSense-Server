const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

const DeviceCommand = sequelize.define('DeviceCommand', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    command: {
        type: DataTypes.STRING,
        allowNull: false
    },
    initiateBy: {
        type:DataTypes.STRING,
        allowNull: false
    },
    deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recordedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
},{
    tableName: "device_commands",
    timestamps: false,
});

module.exports = DeviceCommand;
