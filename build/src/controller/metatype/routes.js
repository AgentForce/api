"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const metatype_controller_1 = require("./metatype-controller");
const Metatypevalidate = require("./metatype-validator");
function default_1(server, configs, database) {
    const metatypeController = new metatype_controller_1.default(configs, database);
    server.bind(metatypeController);
    server.route({
        method: 'GET',
        path: '/types/{type}',
        config: {
            handler: metatypeController.findByType,
            // auth: "jwt",
            tags: ['api', 'types'],
            description: 'Get types by type (Api support)',
            validate: {
                params: {
                    type: Joi.string().required()
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'types founded.'
                        },
                        '404': {
                            'description': 'types not found.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/types',
        config: {
            handler: metatypeController.create,
            // auth: "jwt",
            tags: ['api', 'types'],
            description: 'create metatype (Api support)',
            validate: {
                payload: Metatypevalidate.createModel
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'types founded.'
                        },
                        '404': {
                            'description': 'types not found.'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map