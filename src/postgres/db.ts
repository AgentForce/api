// import Farmer from './farmer';
// const fs = require('fs');
// const path = require('path');
import * as Sequelize from 'sequelize';
const config = require('./config/config');
const objconfig = config[process.env.NODE_ENV || 'local'];
const db = new Sequelize(objconfig.database, objconfig.username, objconfig.password, objconfig);
// console.log(objconfig);
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
