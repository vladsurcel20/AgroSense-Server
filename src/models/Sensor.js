const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

const Sensor = sequelize.define('Sensor', {
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
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    height_cm: {
        type: DataTypes.INTEGER,
    },
    width_cm: {
        type: DataTypes.INTEGER,
    },
    length_cm: {
        type: DataTypes.INTEGER,
    },
    radius_cm: {
        type: DataTypes.INTEGER,
    },
    greenhouseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    tableName: "sensors",
    timestamps: false,
});

module.exports = Sensor;
