"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const invite_controller_1 = require("./invite-controller");
const InviteValidator = require("./invite-validator");
function default_1(server, configs, database) {
    const eventController = new invite_controller_1.default(configs, database);
    server.bind(eventController);
    server.route({
        method: 'GET',
        path: '/invites/userid/{userid}',
        config: {
            handler: eventController.findByUserId,
            // auth: "jwt",
            tags: ['api', 'invites'],
            description: 'Get invites by userid',
            validate: {
                params: {
                    userid: Joi.string().required()
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'event founded.'
                        },
                        '404': {
                            'description': 'events not found.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/invites/{id}',
        config: {
            handler: eventController.findById,
            // auth: "jwt",
            tags: ['api', 'invites'],
            description: 'Get invites by id',
            validate: {
                params: {
                    id: Joi.string().required()
                },
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'invite founded.'
                        },
                        '404': {
                            'description': 'invite not found.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/invites',
        config: {
            handler: eventController.create,
            // auth: "jwt",
            tags: ['api', 'invites'],
            description: 'Create a invite',
            validate: {
                payload: InviteValidator.createModel,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created invite'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map