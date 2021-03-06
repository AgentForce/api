import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from 'boom';
import CampaignController from "./campaign-controller";
import * as CampaignValidator from "./campaign-validator";
import { jwtValidator, headerModel } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
/**
 * constant error
 */
import { ManulifeErrors as Ex, MsgCodeResponses } from '../../common/code-errors';
/**
 * plugin log campaign
 */
import { LogCamp } from "../../mongo/index";
import { SlackAlert } from "../../common/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const campaignController = new CampaignController(configs, database);
    server.bind(campaignController);




    /**
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/period/{period}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#drivev3/dangnhap,KH-lienhe:1 #screen11,12,12copy2,12copy3. Trả về danh sách plan 4 tuần của một tháng',
            validate: {
                headers: headerModel,
                params: {
                    period: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    LogCamp.create({
                        type: '/campaigns/current',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        }
                    });
                    reply(Boom);
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
                                        .example(1),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgCode: Joi.string()
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(0),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgCode: Joi.string()
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
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/check',
        config: {
            handler: campaignController.checkCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#screenv3/dangnhap:3 Check campaign exist in current day ',
            validate: {
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    LogCamp.create({
                        type: '/campaigns/current',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        }
                    });
                    reply(Boom);
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
                                        .example(1),
                                    data: Joi
                                        .object({
                                            status: Joi.boolean().example(true)
                                        }),
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
                                        .example(0),
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
     * get a campaign by period
     */
    server.route({
        method: 'GET',
        path: '/campaigns/forwardtarget',
        config: {
            handler: campaignController.checkCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'for screen dashboard: ',
            validate: {
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    reply(Boom);
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
                                        .example(1),
                                    data: Joi
                                        .object({
                                            status: Joi.boolean().example(true)
                                        }),
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
                                        .example(0),
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
        * forcast
        */
    server.route({
        method: 'GET',
        path: '/campaigns/forcast',
        config: {
            handler: campaignController.forcast,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'API for SM. forcast target',
            validate: {
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    LogCamp.create({
                        type: 'createcamp',
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
                            description: 'success',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(1),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(0),
                                    data: Joi.object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
     * creat new campaign fa
     */
    server.route({
        method: 'POST',
        path: '/campaigns/fa',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign FA',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    LogCamp.create({
                        type: 'createcamp',
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
                            description: 'success',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(1),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(0),
                                    data: Joi.object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
   * creat new campaign fa
   */
    server.route({
        method: 'POST',
        path: '/campaigns/sm',
        config: {
            handler: campaignController.createCampaignSM,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign SM',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    LogCamp.create({
                        type: 'createcamp',
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
                            description: 'success',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(1),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(0),
                                    data: Joi.object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
    * creat new campaign fa
    */
    server.route({
        method: 'POST',
        path: '/campaigns/um',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign UM',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                headers: headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
                    };
                    SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    LogCamp.create({
                        type: 'createcamp',
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
                            description: 'success',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(1),
                                    data: Joi
                                        .object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(0),
                                    data: Joi.object(),
                                    msg: Joi.string(),
                                    msgcode: Joi.string()
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
}