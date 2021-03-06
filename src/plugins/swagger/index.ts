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
                                [ document api \
                                ](https://1drv.ms/w/s!AqHtODf7o0eageFb46YAIgIQwy0dEw)",
                                version: '1.0'
                            },
                            tags: [{
                                'name': 'campaigns',
                                'description': 'campaigns'
                            }, {
                                'name': 'leads',
                                'description': 'leads.'
                            }, {
                                'name': 'activities',
                                'description': 'activities'
                            }, {
                                'name': 'users',
                                'description': 'users.'
                            }],
                            // payloadType: 'form',
                            // tagsGroupingFilter: 'users',
                            swaggerUI: true,
                            // prefix: '/tu',
                            basePath: '/api',
                            pathPrefixSize: 2,
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