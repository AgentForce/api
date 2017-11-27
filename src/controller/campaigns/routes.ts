import * as Hapi from "hapi";
import * as Joi from "joi";
import CampaignController from "./campaign-controller";
import * as CampaignValidator from "./campaign-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { ManulifeErrors as Ex } from '../../helpers/code-errors';
import { LogCamp } from "../../mongo/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const campaignController = new CampaignController(configs, database);
    server.bind(campaignController);
    /**
         * lấy 1 campaign theo campaignid
         */
    server.route({
        method: 'GET',
        path: '/campaigns/{id}/customers/{type}',
        config: {
            handler: campaignController.leadsOfCamp,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get Customer(leads) in a campaigns by id.',
            validate: {
                params: {
                    id: Joi.number().required().description('Campaignid'),
                    type: Joi.number().required().valid([1, 2, 3, 4])
                        .description('4 processtep in lead')
                },
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogCamp.create({
                        type: '/campaigns/{id}/customers/{type}',
                        dataInput: {
                            params: request.params,
                        },
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
                            status: HTTP_STATUS.OK,
                            'description': 'Campaign .'
                        },
                        '404': {
                            'description': 'Campaign does not exists.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaign by campaignid.',
            validate: {
                params: {
                    id: Joi.number().required().description('campaignid')
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
                        type: '/campaigns/{id}/customers/{type}',
                        dataInput: {
                            params: request.params,
                        },
                        msg: 'params do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    reply(res);
                }
                // headers: jwtValidator

            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'Campaign founded.'
                        },
                        '404': {
                            'description': 'Campaign does not exists.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.updateCurrent,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'update a campaign.(waiting feedback flow)',
            validate: {
                payload: CampaignValidator.updateModel,
                params: {
                    id: Joi.number().required()
                        .example(240)
                        .description('campaignid')
                },
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogCamp.create({
                        type: 'updatecamp',
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
                            'description': 'update campaign.'
                        },
                        '400': {
                            description: 'update fail'
                        }
                    }
                }
            }
        }
    });



    // server.route({
    //     method: 'GET',
    //     path: '/campaigns/userid/{userid}',
    //     config: {
    //         handler: campaignController.getByUserId,
    //         // auth: "jwt",
    //         tags: ['api', 'campaigns'],
    //         description: 'Get all campaigns by userid.',
    //         validate: {
    //             params: {
    //                 userid: Joi.string().required()
    //             },
    //             // headers: jwtValidator
    //             failAction: (request, reply, source, error) => {
    //                 let res = {
    //                     status: HTTP_STATUS.BAD_REQUEST, error: {
    //                         code: 'ex_payload',
    //                         msg: 'params dont valid',
    //                         details: error
    //                     }
    //                 };
    //                 LogCamp.create({
    //                     type: 'get',
    //                     dataInput: request.payload,
    //                     msg: 'params do not valid',
    //                     meta: {
    //                         exception: error,
    //                         response: res
    //                     },
    //                 });
    //                 return reply(res);
    //             }
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     '200': {
    //                         'description': 'Campaign founded.'
    //                     },
    //                     '404': {
    //                         'description': 'Campaign does not exists.'
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });

    server.route({
        method: 'POST',
        path: '/campaigns',
        config: {
            handler: campaignController.createCampaign,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Create a campaign.',
            validate: {
                payload: CampaignValidator.createCampaignFAModel,
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
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
                        '200': {
                            'description': 'Created campaign.'
                        }
                    }
                }
            }
        }
    });
}