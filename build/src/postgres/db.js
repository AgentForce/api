"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Farmer from './farmer';
// const fs = require('fs');
// const path = require('path');
const Sequelize = require("sequelize");
const config = require('./config/config.json');
console.log('evn' + process.env.NODE_ENV);
const objconfig = config[process.env.NODE_ENV || 'aws'];
console.log(config);
const db = new Sequelize(objconfig.database, objconfig.username, objconfig.password, objconfig);
exports.db = db;
// export { db, Farmer };
// export { User };
//# sourceMappingURL=db.js.map