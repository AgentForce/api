import { IPlugin, IPluginInfo } from "../interfaces";
import * as Hapi from "hapi";
export default (): IPlugin => {
    return {
        register: (server: Hapi.Server): Promise<void> => {

            return new Promise<void>((resolve) => {
                server.register([
                    require('inert'),
                    require('vision'), {
                        register: require('hapi-swagger'),
                        options: {
                            info: {
                                title: 'Manulife Api',
                                description: 'Manulife Api Documentation',
                                version: '1.0'
                            },
                            tags: [{
                                'name': 'leads',
                                'description': 'leads tasks interface.'
                            }, {
                                'name': 'users',
                                'description': 'users interface.'
                            }],
                            payloadType: 'form',
                            // tagsGroupingFilter: 'users',
                            swaggerUI: true,
                            basePath: '/api',
                            documentationPage: true,
                            documentationPath: '/olddocs',
                            securityDefinitions: {
                                'jwt': {
                                    "type": "apiKey",
                                    "name": "authorization",
                                    "in": "header"
                                }
                            }
                        },

                    }
                ], (error) => {
                    if (error) {
                        console.log(`Error registering swagger plugin: ${error}`);
                    }

                    resolve();
                });
            });
        },
        info: () => {
            return {
                name: "Swagger Documentation",
                version: "1.0.0"
            };
        }
    };
};