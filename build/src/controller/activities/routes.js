"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const activity_controller_1 = require("./activity-controller");
const ActivitiesValidator = require("./activity-validator");
const user_validator_1 = require("../users/user-validator");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const index_2 = require("../../common/index");
function default_1(server, configs, database) {
    const activitiesController = new activity_controller_1.default(configs, database);
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
                headers: user_validator_1.headerModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .array().items({}),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
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
                headers: user_validator_1.headerModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    data: Joi.array().example([]),
                                    limit: Joi.number(),
                                    page: Joi.number()
                                }),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
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
                },
                headers: user_validator_1.headerModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({}),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
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
                },
                headers: user_validator_1.headerModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    data: Joi.array(),
                                    totalCount: 20,
                                    page: 1,
                                    limit: 10
                                }),
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
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
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: '#screenv3/KH-hengap:18 Create a activity.',
            validate: {
                payload: ActivitiesValidator.createModel,
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogActivity.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
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
                headers: user_validator_1.headerModel,
                params: {
                    id: Joi.number().required()
                        .description('acitivityId')
                        .example(12)
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    index_1.LogActivity.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                data: Joi.object(),
                                msg: Joi.string(),
                                msgCode: Joi.string()
                            })
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