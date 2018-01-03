"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
exports.Connection = Mongoose;
const configurations_1 = require("../configurations");
Mongoose.Promise = Promise;
Mongoose.connect(process.env.MONGO_URL || configurations_1.getDatabaseConfig().connectionString, { useMongoClient: true });
//# sourceMappingURL=connection.js.map