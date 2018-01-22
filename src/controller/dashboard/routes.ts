import * as Hapi from "hapi";
import * as Joi from "joi";
import DashboardController from "./dashboard-controller";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { ManulifeErrors as Ex } from '../../common/code-errors';
import { LogCamp } from "../../mongo/index";
import { SlackAlert } from "../../common/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const dashboardController = new DashboardController(configs, database);
    server.bind(dashboardController);

    /**
     * get list leads of campaign with type and campaignid
     */
    server.route({
        method: 'GET',
        path: '/dashboard/{type}',
        config: {
            handler: dashboardController.dashboard,
            // auth: "jwt",
            tags: ['api', 'dashboard'],
            description: '#screenhomepage',
            validate: {
                params: {
                    type: Joi.string()
                        .valid(['week', 'month', 'year'])
                        .required()
                        .description('userid')
                },
                // headers: jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST, error: {
                            code: Ex.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogCamp.create({
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
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
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
                                }
                            )
                        },
                        400: {
                            description: 'Error something',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(HTTP_STATUS.BAD_REQUEST),
                                    error: Joi.string(),
                                    code: Joi.string()
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