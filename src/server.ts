import * as Hapi from "hapi";
import * as Boom from "boom";
import { IPlugin } from "./plugins/interfaces";
import { IServerConfigurations } from "./configurations";
import * as Users from "./controller/users";
// import * as Campaigns from "./controller/campaigns";
import { IDatabase } from "./database";


export function init(configs: IServerConfigurations, database: IDatabase): Promise<Hapi.Server> {

    return new Promise<Hapi.Server>(resolve => {

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
        const plugins: Array<string> = configs.plugins;
        const pluginOptions = {
            database: database,
            serverConfigs: configs
        };

        let pluginPromises = [];

        plugins.forEach((pluginName: string) => {
            var plugin: IPlugin = (require("./plugins/" + pluginName)).default();
            console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
            pluginPromises.push(plugin.register(server, pluginOptions));
        });

        Promise.all(pluginPromises).then(() => {
            console.log('All plugins registered successfully.');

            console.log('Register Routes');
            Users.init(server, configs, database);
            // Campaigns.init(server, configs, database);
            console.log('Routes registered sucessfully.');

            resolve(server);
        });
    });
}
