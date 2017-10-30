"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = require("hapi");
const Users = require("./controller/users");
const Campaigns = require("./controller/campaigns");
function init(configs, database) {
    return new Promise(resolve => {
        const port = process.env.PORT;
        const server = new Hapi.Server();
        server.connection({
            port: port,
            routes: {
                cors: true
            }
        });
        if (configs.routePrefix) {
            server.realm.modifiers.route.prefix = configs.routePrefix;
        }
        //  Setup Hapi Plugins
        const plugins = configs.plugins;
        const pluginOptions = {
            database: database,
            serverConfigs: configs
        };
        let pluginPromises = [];
        plugins.forEach((pluginName) => {
            var plugin = (require("./plugins/" + pluginName)).default();
            console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
            pluginPromises.push(plugin.register(server, pluginOptions));
        });
        Promise.all(pluginPromises).then(() => {
            console.log('All plugins registered successfully.');
            console.log('Register Routes');
            Users.init(server, configs, database);
            Campaigns.init(server, configs, database);
            console.log('Routes registered sucessfully.');
            resolve(server);
        });
    });
}
exports.init = init;
//# sourceMappingURL=server.js.map