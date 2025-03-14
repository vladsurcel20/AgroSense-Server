const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const UserRole = sequelize.define("UserRole", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: "user_roles",
    timestamps: false
});

module.exports = UserRole;