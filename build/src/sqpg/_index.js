"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
let db = {};
const dbConfig = {
    "username": "das v",
    "password": "da$AgriT3ch",
    "database": "das",
    "host": "103.48.191.251",
    "port": 5432,
    "dialect": "postgres",
    "logging": true,
    "force": true,
    "timezone": "+00:00"
};
const sequelize = new Sequelize(dbConfig['database'], dbConfig['username'], dbConfig['password'], dbConfig);
const basename = path.basename(module.filename);
fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(function (file) {
    const model = sequelize['import'](path.join(__dirname, file));
    // NOTE: you have to change from the original property notation to
    // index notation or tsc will complain about undefined property.
    db[model['name']] = model;
});
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;
exports.default = db;
//# sourceMappingURL=_index.js.map