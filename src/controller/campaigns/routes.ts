import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from 'boom';
import CampaignController from "./campaign-controller";
import * as CampaignValidator from "./campaign-validator";
import { jwtValidator } from "../users/user-validator";
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
                // headers: jwtValidator,
                params: {
                    period: Joi.number()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
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
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
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
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'params dont valid',
                            details: error
                        }
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
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.NOT_FOUND),
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


    /**
     * creat new campaign
     */
    server.route({
        method: 'POST',
        path: '/campaigns',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: '#googledrive/dangky #screen10. Create a campaign',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
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
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
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