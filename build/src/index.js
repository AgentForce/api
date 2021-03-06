"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server = require("./server");
const Database = require("./database");
const Configs = require("./configurations");
//console.log(`Running enviroment ${process.env.NODE_ENV || "dev"}`);
// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error) => {
    console.error(`uncaughtException ${error.message}`);
});
// Catch unhandling rejected promises
process.on('unhandledRejection', (reason) => {
    console.error(`unhandledRejection ${reason}`);
});
// Init Database
const dbConfigs = Configs.getDatabaseConfig();
const database = Database.init(dbConfigs);
// Init DatabasePg
//const databasepg = DatabasePg.init(dbConfigs);
// console.log(dbConfigs);
// Starting Application Server
const serverConfigs = Configs.getServerConfigs();
Server.init(serverConfigs, database).then((server) => {
    server.start(() => {
        console.log(`server running at: ${server.info.uri} env ${process.env.NODE_ENV}`);
    });
});
//# sourceMappingURL=index.js.map