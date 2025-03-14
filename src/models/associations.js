const User = require("./User");
const UserRole = require("./UserRole");

UserRole.hasMany(User, { foreignKey: "roleId", as: "users", onDelete: "SET NULL", onUpdate: "CASCADE" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "role", onDelete: "SET NULL", onUpdate: "CASCADE" });


module.exports = { User, UserRole };