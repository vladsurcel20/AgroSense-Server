const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const GreenhousePreference = sequelize.define("GreenhousePreference", {
    greenhouseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    minTemp: {
        type: DataTypes.FLOAT,
    },
    maxTemp: {
        type: DataTypes.FLOAT,
    },
    minHum: {
        type: DataTypes.FLOAT,
    },
    maxHum: {
        type: DataTypes.FLOAT,
    },
    minLight: {
        type: DataTypes.FLOAT,
    },
    maxLight: {
        type: DataTypes.FLOAT,
    },
    }, {
        tableName: "greenhouse_preferences",
    });

module.exports = GreenhousePreference;