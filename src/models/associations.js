const User = require("./User");
const UserRole = require("./UserRole");
const Location = require("./Location");
const GreenHouse = require("./Greenhouse");
const Culture = require("./Culture");
const GreenhousePreference = require("./GreenhousePreference");


UserRole.hasMany(User, { foreignKey: "roleId", as: "users", onDelete: "SET NULL", onUpdate: "CASCADE" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "role", onDelete: "SET NULL", onUpdate: "CASCADE" });

User.hasMany(Location, { foreignKey: "userId", as: "locations", onDelete: "CASCADE", onUpdate: "CASCADE" });
Location.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(GreenHouse, { foreignKey: "userId", as: "greenhouses", onDelete: "CASCADE", onUpdate: "CASCADE" });
GreenHouse.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });

Location.hasMany(GreenHouse, { foreignKey: "locationId", as: "greenhouses", onDelete: "SET NULL", onUpdate: "CASCADE" });
GreenHouse.belongsTo(Location, { foreignKey: "locationId", as: "location", onDelete: "SET NULL", onUpdate: "CASCADE" });

Culture.hasMany(GreenHouse, { foreignKey: "cultureId", as: "greenhouses", onDelete: "SET NULL", onUpdate: "CASCADE" });
GreenHouse.belongsTo(Culture, { foreignKey: "cultureId", as: "culture", onDelete: "SET NULL", onUpdate: "CASCADE" });

GreenhousePreference.belongsTo(GreenHouse, { foreignKey: "greenhouseId", as: "greenhouse", onDelete: "CASCADE", onUpdate: "CASCADE" });
GreenHouse.hasOne(GreenhousePreference, { foreignKey: "greenhouseId", as: "preference", onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = { User, UserRole, Location, GreenHouse };