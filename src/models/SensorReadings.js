const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

const SensorReading = sequelize.define('SensorReading', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sensorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    recordedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    
},{
    tableName: "sensor_readings",
    timestamps: false,
});

module.exports = SensorReading;
