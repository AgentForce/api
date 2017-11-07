// import Farmer from './farmer';

// const fs = require('fs');
// const path = require('path');
import * as Sequelize from 'sequelize';

// const basename = path.basename(module.filename);
const dbConfig = {
    "username": "das",
    "password": "da$AgriT3ch",
    "database": "postgres",
    "host": "103.48.191.251",
    "port": 5432,
    "dialect": "postgres",
    // "logging": true,
    // "force": true,
    "timezone": "+00:00"
};
// const objconfig = config[process.env.NODE_ENV || 'develop'].postgres;
// console.log(objconfig);
const db = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
// Export the db Object
// db.sync().then(function () {
//     console.log('DB connection sucessful.');
// }, function (err) {
//     // catch error here
//     console.log('show log');
//     console.log(err);

// });
export { db };
// export { db, Farmer };
// export { User };
