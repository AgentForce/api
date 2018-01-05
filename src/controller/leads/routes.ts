import * as Hapi from "hapi";
import * as Joi from "joi";
import LeadController from "./lead-controller";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { LogLead } from "../../mongo/index";
import { ManulifeErrors as Ex } from '../../helpers/code-errors';
import * as LeadValidator from "./lead-validator";
import { Constants, ManulifeErrors } from "../../helpers/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
    const leadController = new LeadController(configs, database);
    server.bind(leadController);


    server.route({
        method: 'GET',
        path: '/leads/{id}',
        config: {
            handler: leadController.findById,
            auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Find a lead by leadId',
            validate: {
                params: {
                    id: Joi.number()
                        .required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD, msg:
                                'payload dont valid',
                            details: error
                        }
                    };
                    LogLead.create({
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
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        404: {
                            description: 'not found',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    code: Joi.string().example(ManulifeErrors.EX_LEADID_NOT_FOUND),
                                    msg: Joi.string()
                                }
                            )
                        },

                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });


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
                            code: Ex.EX_PAYLOAD, msg:
                                'payload dont valid',
                            details: error
                        }
                    };
                    LogLead.create({
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
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        404: {
                            description: 'not found',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .array().items({

                                        }),
                                }
                            )
                        }
                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });

    /**
     * Update a lead
     */
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
                    id: Joi
                        .number().
                        required()
                        .example(38)
                        .description('leadid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogLead.create({
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


    /**
     * create new a lead
     */
    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Create new lead',
            validate: {
                payload: LeadValidator.createLeadModel,
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD, msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogLead.create({
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
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });
}