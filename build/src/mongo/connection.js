"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const configurations_1 = require("../configurations");
Mongoose.Promise = Promise;
Mongoose.connect(process.env.MONGO_URL || configurations_1.getDatabaseConfig().connectionString, { useMongoClient: true });
let mongoDb = Mongoose.connection;
exports.Connection = mongoDb;
mongoDb.on('error', () => {
    console.log(`Unable to connect to database: ${configurations_1.getDatabaseConfig().connectionString}`);
});
mongoDb.once('open', () => {
    console.log(`Connected to database: ${configurations_1.getDatabaseConfig().connectionString}`);
});
//# sourceMappingURL=connection.js.map