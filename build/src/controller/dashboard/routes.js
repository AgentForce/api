"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const dashboard_controller_1 = require("./dashboard-controller");
const user_validator_1 = require("../users/user-validator");
const code_errors_1 = require("../../common/code-errors");
const index_1 = require("../../mongo/index");
function default_1(server, configs, database) {
    const dashboardController = new dashboard_controller_1.default(configs, database);
    server.bind(dashboardController);
    /**
     * get list leads of campaign with type and campaignid
     */
    server.route({
        method: 'GET',
        path: '/campaigns/dashboard/{type}',
        config: {
            handler: dashboardController.dashboard,
            // auth: "jwt",
            tags: ['api', 'dashboard'],
            description: '#screenhomepage',
            validate: {
                headers: user_validator_1.headerModel,
                params: {
                    type: Joi.string()
                        .valid(['weekmonth', 'year'])
                        .required()
                        .description('userid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: 0,
                        data: error,
                        msgCode: code_errors_1.MsgCodeResponses.INPUT_INVALID,
                        msg: code_errors_1.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogCamp.create({
                        type: '/dashboard/{type}',
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
                    // deprecated: true,
                    responses: {
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(1),
                                data: Joi
                                    .object({
                                    targetType: Joi
                                        .string(),
                                    target: Joi.object()
                                        .example({}),
                                    campaign: Joi.object()
                                        .example({}),
                                    activities: Joi.array()
                                        .example([]),
                                }),
                                msg: Joi.string(),
                                msgcode: Joi.string()
                            })
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(0),
                                error: Joi.string(),
                                msg: Joi.string(),
                                msgcode: Joi.string()
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