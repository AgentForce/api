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
                                description: "Manulife Api Documentation\
                                [link document api google doc\
                                ](https://docs.google.com/document/d/12GxLBgiOhIdsZm5nliNah8dVtxxNb06LEr0wEYwmxjg/edit)",
                                version: '1.0'
                            },
                            tags: [{
                                'name': 'leads',
                                'description': 'leads.'
                            }, {
                                'name': 'users',
                                'description': 'users.'
                            }],
                            // payloadType: 'form',
                            // tagsGroupingFilter: 'users',
                            swaggerUI: true,
                            basePath: '/api',
                            documentationPage: true,
                            documentationPath: '/docsold',
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