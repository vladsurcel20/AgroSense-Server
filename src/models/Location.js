const {Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const Location = sequelize.define("Location", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastVisited: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    }, {
        tableName: "locations",
        timestamps: false,
});

module.exports = Location;