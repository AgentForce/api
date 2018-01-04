import * as nconf from 'nconf';
import * as path from 'path';

//Read Configurations
const configs = new nconf.Provider({
    env: true,
    argv: true,
    store: {
        type: 'file',
        file: path.join(__dirname, `./config.${process.env.NODE_ENV || 'dev'}.json`)
    }
});

export interface IServerConfigurations {
    port: number;
    plugins: Array<string>;
    jwtSecret: string;
    jwtExpiration: string;
    routePrefix: string;
}

export interface IDataPgConfiguration {
    username: string;
    password: string;
    database: string;
    host: string;
    post: number;
    dialect: string;
    logging: boolean;
    force: boolean;
    timezone: string;
}

export interface IDataConfiguration {
    connectionString: string;
}

export function getDatabaseConfig(): IDataConfiguration {
    return configs.get('database');
}

export function getDatabasePgConfig(): IDataPgConfiguration {
    return configs.get('development');
}

export function getServerConfigs(): IServerConfigurations {
    return configs.get('server');
}

export function getRedisConfigs(): string {
    return configs.get('redis');
}
