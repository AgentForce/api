"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var db = {};
var dbConfig = {
    "username": "das",
    "password": "da$AgriT3ch",
    "database": "das",
    "host": "103.48.191.251",
    "port": 5432,
    "dialect": "postgres",
    "logging": true,
    "force": true,
    "timezone": "+00:00"
};
var sequelize = new Sequelize(dbConfig['database'], dbConfig['username'], dbConfig['password'], dbConfig);
var basename = path.basename(module.filename);
fs
    .readdirSync(__dirname)
    .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
    .forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
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
exports["default"] = db;
