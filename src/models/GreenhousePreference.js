const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const GreenhousePreference = sequelize.define("GreenhousePreference", {
    greenhouseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    minTempAir: {
        type: DataTypes.FLOAT,
    },
    maxTempAir: {
        type: DataTypes.FLOAT,
    },
    minTempSoil: {
        type: DataTypes.FLOAT,
    },
    maxTempSoil: {
        type: DataTypes.FLOAT,
    },
    minHumAir: {
        type: DataTypes.FLOAT,
    },
    maxHumAir: {
        type: DataTypes.FLOAT,
    },
    minHumSoil: {
        type: DataTypes.FLOAT,
    },
    maxHumSoil: {
        type: DataTypes.FLOAT,
    },
    minLight: {
        type: DataTypes.FLOAT,
    },
    maxLight: {
        type: DataTypes.FLOAT,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
    }, {
        tableName: "greenhouse_preferences",
    });

module.exports = GreenhousePreference;