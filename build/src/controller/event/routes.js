"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const event_controller_1 = require("./event-controller");
const CampaignValidator = require("./event-validator");
function default_1(server, configs, database) {
    const eventController = new event_controller_1.default(configs, database);
    server.bind(eventController);
    server.route({
        method: 'GET',
        path: '/events/userid/{userid}',
        config: {
            handler: eventController.findByUserId,
            // auth: "jwt",
            tags: ['api', 'events'],
            description: 'Get events by userid',
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
        path: '/events/{id}',
        config: {
            handler: eventController.findById,
            // auth: "jwt",
            tags: ['api', 'events'],
            description: 'Get events by id',
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
        method: 'POST',
        path: '/events',
        config: {
            handler: eventController.create,
            // auth: "jwt",
            tags: ['api', 'events'],
            description: 'Create a event',
            validate: {
                payload: CampaignValidator.createModel,
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created event'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map