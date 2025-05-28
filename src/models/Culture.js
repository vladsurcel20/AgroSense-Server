const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const Culture = sequelize.define("Culture", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    minTempAir: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxTempAir: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minTempSoil: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxTempSoil: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minHumAir: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxHumAir: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minHumSoil: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxHumSoil: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minLight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxLight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
    }, {
        tableName: "cultures",
});

module.exports = Culture;
