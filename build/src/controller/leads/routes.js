"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const lead_controller_1 = require("./lead-controller");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const LeadValidator = require("./lead-validator");
function default_1(server, configs, database) {
    const leadController = new lead_controller_1.default(configs, database);
    server.bind(leadController);
    server.route({
        method: 'GET',
        path: '/leads/detail/{id}',
        config: {
            handler: leadController.detail,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'find detail a lead with list activities',
            validate: {
                params: {
                    id: Joi.number()
                        .required().example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'detaillead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Lead found'
                        },
                        '404': {
                            description: 'lead not found'
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    server.route({
        method: 'PUT',
        path: '/leads/{id}',
        config: {
            handler: leadController.update,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'update a leads',
            validate: {
                payload: LeadValidator.updateModel,
                params: {
                    id: Joi.number().required().example(38).description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'updatelead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Lead updated'
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Create a lead',
            validate: {
                payload: LeadValidator.createLeadModel,
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogLead.create({
                        type: 'createlead',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Created lead.'
                        }
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map