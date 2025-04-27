const { Sequelize, DataTypes } = require("sequelize");
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
}, {
    tableName: "user_roles",
});

module.exports = UserRole;