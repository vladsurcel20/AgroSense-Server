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
    minTemp: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxTemp: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minHum: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxHum: {
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
