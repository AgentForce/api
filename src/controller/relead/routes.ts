import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from 'boom';
import CampaignController from "./relead-controller";
import * as CampaignValidator from "./relead-validator";
import { jwtValidator, headerModel } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
/**
 * constant error
 */
import { ManulifeErrors as Ex } from '../../common/code-errors';
/**
 * plugin log campaign
 */
import { LogCamp } from "../../mongo/index";
import { SlackAlert } from "../../common/index";
import { request } from "https";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const campaignController = new CampaignController(configs, database);
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
                headers: headerModel,
                params: {
                    id: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
                headers: headerModel,
                params: {
                    period: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
                headers: headerModel,
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
                            code: Ex.EX_PAYLOAD,
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
                headers: headerModel,
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
                            code: Ex.EX_PAYLOAD,
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
                headers: headerModel,
                params: {
                    id: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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