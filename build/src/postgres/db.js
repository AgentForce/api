"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Farmer from './farmer';
// const fs = require('fs');
// const path = require('path');
const Sequelize = require("sequelize");
const config = require('./config/config');
const objconfig = config[process.env.NODE_ENV || 'local'];
const db = new Sequelize(objconfig.database, objconfig.username, objconfig.password, objconfig);
exports.db = db;
// export { db, Farmer };
// export { User };
//# sourceMappingURL=db.js.map