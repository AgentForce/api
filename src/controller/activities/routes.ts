import * as Hapi from "hapi";
import * as Joi from "joi";
import ActivityController from "./activity-controller";
import * as ActivitiesValidator from "./activity-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { LogActivity } from "../../mongo/index";
import { ManulifeErrors as Ex } from '../../common/code-errors';
import { SlackAlert } from "../../common/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const activitiesController = new ActivityController(configs, database);
    server.bind(activitiesController);



    /**
     * history activity in  a period
     */
    server.route({
        method: 'GET',
        path: '/activities/rangedate/{from}/{to}',
        config: {
            handler: activitiesController.calendar,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: '#v3/dangnhap:13 Get activities in rangeDate group by day',
            validate: {
                params: {
                    from: Joi
                        .date()
                        .default('2018-01-01')
                        .required(),
                    to: Joi
                        .date()
                        .default('2018-01-31')
                        .required(),
                },
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
                                        .object({
                                            data: Joi.array().example([]),
                                            limit: Joi.number(),
                                            page: Joi.number()
                                        })
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
                                }
                            )
                        }
                    }
                }
            }
        }
    });


    /**
    * history activity in  a period
    */
    server.route({
        method: 'GET',
        path: '/activities/day/{date}',
        config: {
            handler: activitiesController.activitiesDay,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: '#v3/dangnhap:13 Get activities in Day',
            validate: {
                params: {
                    date: Joi
                        .date()
                        .default('2018-01-01')
                        .required()
                },
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
                                        .object({
                                            data: Joi.array().example([]),
                                            limit: Joi.number(),
                                            page: Joi.number()
                                        })
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
                                }
                            )
                        }
                    }
                }
            }
        }
    });

    // /**
    //  * history activity of a lead
    //  */
    // server.route({
    //     method: 'GET',
    //     path: '/activities/lead/{leadid}/{processstep}',
    //     config: {
    //         handler: activitiesController.historyOfLead,
    //         // auth: "jwt",
    //         tags: ['api', 'activities'],
    //         description: 'Get activities by leadid, paginate by parameter limit and page',
    //         validate: {
    //             params: {
    //                 leadid: Joi
    //                     .number()
    //                     .integer()
    //                     .required(),
    //                 processstep: Joi
    //                     .number()
    //                     .integer()
    //                     .valid([-1, 1, 2, 3, 4, 5])
    //                     .description('-1 to get all'),
    //             },
    //             query: Joi.object({
    //                 limit: Joi
    //                     .number()
    //                     .integer()
    //                     .default(20)
    //                     .required(),
    //                 page: Joi
    //                     .number()
    //                     .integer()
    //                     .default(1)
    //                     .required()
    //             })
    //             // headers: jwtValidator
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     200: {
    //                         description: '',
    //                         schema: Joi.object(
    //                             {
    //                                 status: Joi
    //                                     .number()
    //                                     .example(200),
    //                                 data: Joi
    //                                     .object({
    //                                         data: Joi.array().example([]),
    //                                         limit: Joi.number(),
    //                                         page: Joi.number()
    //                                     })
    //                             }
    //                         )
    //                     },
    //                     400: {
    //                         description: '',
    //                         schema: Joi.object(
    //                             {
    //                                 status: Joi
    //                                     .number()
    //                                     .example(HTTP_STATUS.BAD_REQUEST),
    //                                 error: Joi.string(),
    //                             }
    //                         )
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });

    /**
    * history activity by id
    */
    server.route({
        method: 'GET',
        path: '/activities/{id}',
        config: {
            handler: activitiesController.findById,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: '#screenv3/KH-lienhe:20 Get a activity by id',
            validate: {
                params: {
                    id: Joi
                        .number()
                        .integer()
                        .required(),
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
                                        .object({
                                            data: Joi.object(),
                                        })
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
                                }
                            )
                        }
                    }
                }
            }
        }
    });



      /**
    * history activities of leads
    */
    server.route({
        method: 'GET',
        path: '/activities/leadid/{leadid}',
        config: {
            handler: activitiesController.activitiesLead,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: '#screenv3/KH-hengap:19 Get list activities by leadid',
            validate: {
                params: {
                    leadid: Joi
                        .number()
                        .integer()
                        .required(),
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
                                        .object({
                                            data: Joi.object(),
                                        })
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
                                }
                            )
                        }
                    }
                }
            }
        }
    });


    /**
     * create new activity
     */
    server.route({
        method: 'POST',
        path: '/activities',
        config: {
            handler: activitiesController.create,
            auth: "jwt",
            tags: ['api', 'activities'],
            description: '#screenv3/KH-hengap:18 Create a activity.',
            validate: {
                payload: ActivitiesValidator.createModel,
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
                    LogActivity.create({
                        type: 'createactivty',
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
                                        .example(HTTP_STATUS.OK),
                                    data: Joi.object(),
                                }
                            )
                        },
                        400: {
                            description: '',
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


    /**
     * update a activity
     */
    server.route({
        method: 'PUT',
        path: '/activities/{id}',
        config: {
            handler: activitiesController.update,
            auth: "jwt",
            tags: ['activities', 'api'],
            description: 'Update a activity',
            validate: {
                payload: ActivitiesValidator.updateModel,
                params: {
                    id: Joi.number().required()
                        .description('acitivityId')
                        .example(12)
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    LogActivity.create({
                        type: 'update activity',
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
                                        .example(HTTP_STATUS.OK),
                                    data: Joi.object(),
                                }
                            )
                        },
                        400: {
                            description: '',
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