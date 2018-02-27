import * as Hapi from "hapi";
import * as Joi from "joi";
import DashboardController from "./dashboard-controller";
import { jwtValidator, headerModel } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { ManulifeErrors as Ex, MsgCodeResponses } from '../../common/code-errors';
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
        path: '/campaigns/dashboard/{type}',
        config: {
            handler: dashboardController.dashboard,
            // auth: "jwt",
            tags: ['api', 'dashboard'],
            description: '#screenhomepage',
            validate: {
                headers: headerModel,
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
                        msgCode: MsgCodeResponses.INPUT_INVALID,
                        msg: MsgCodeResponses.INPUT_INVALID
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
                                    error: Joi.string(),
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