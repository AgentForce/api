"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return {
        register: (server) => {
            return new Promise((resolve) => {
                server.register([
                    require('inert'),
                    require('vision'), {
                        register: require('hapi-swagger'),
                        options: {
                            info: {
                                title: 'Manulife Api',
                                description: "Manulife Api Documentation\
                                [link document api google doc\
                                ](https://1drv.ms/w/s!AqHtODf7o0eageFb46YAIgIQwy0dEw)",
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
//# sourceMappingURL=index.js.map