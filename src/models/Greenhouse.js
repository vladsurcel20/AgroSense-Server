const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");


const Greenhouse = sequelize.define("Greenhouse", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    cultureId: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING(50),
    },
    lastVisited: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    locationId: {
        type: DataTypes.INTEGER,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    }, {
        tableName: "greenhouses",
        timestamps: false,
});

module.exports = Greenhouse;
