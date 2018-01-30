"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const relead_controller_1 = require("./relead-controller");
const user_validator_1 = require("../users/user-validator");
const HTTP_STATUS = require("http-status");
/**
 * constant error
 */
const code_errors_1 = require("../../common/code-errors");
function default_1(server, configs, database) {
    const campaignController = new relead_controller_1.default(configs, database);
    server.bind(campaignController);
    /**
     * get
     */
    server.route({
        method: 'GET',
        path: '/releads/{id}',
        config: {
            handler: campaignController.get,
            // auth: "jwt",
            tags: ['api', 'releads'],
            description: 'get relead',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    id: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
         * get list relead
         */
    server.route({
        method: 'GET',
        path: '/releads/period/{period}',
        config: {
            handler: campaignController.list,
            // auth: "jwt",
            tags: ['api', 'releads'],
            description: 'get list in a period, if get all: period=0',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    period: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
            * create relead
            */
    server.route({
        method: 'POST',
        path: '/releads',
        config: {
            handler: campaignController.create,
            // auth: "jwt",
            tags: ['api', 'releads'],
            description: 'create a relead',
            validate: {
                headers: user_validator_1.headerModel,
                payload: {
                    Phone: Joi
                        .string()
                        .required(),
                    FullName: Joi
                        .string()
                        .required(),
                    CampId: Joi
                        .number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
            * create relead
            */
    server.route({
        method: 'PUT',
        path: '/releads/{id}',
        config: {
            handler: campaignController.get,
            // auth: "jwt",
            tags: ['api', 'releads'],
            description: 'update a relead',
            validate: {
                headers: user_validator_1.headerModel,
                payload: {
                    Phone: Joi
                        .string()
                        .required(),
                    FullName: Joi
                        .string()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                    security: [{
                            'jwt': []
                        }]
                }
            }
        }
    });
    /**
        * get list relead
        */
    server.route({
        method: 'DELETE',
        path: '/releads/{id}',
        config: {
            handler: campaignController.get,
            // auth: "jwt",
            tags: ['api', 'releads'],
            description: 'delete a relead',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    id: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
                    };
                }
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        404: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(HTTP_STATUS.NOT_FOUND),
                                data: Joi
                                    .object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
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
exports.default = default_1;
//# sourceMappingURL=routes.js.map