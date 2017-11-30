import * as Hapi from "hapi";
import * as Joi from "joi";
import DashboardController from "./dashboard-controller";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { ManulifeErrors as Ex } from '../../helpers/code-errors';
import { LogCamp } from "../../mongo/index";
import { SlackAlert } from "../../helpers/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const dashboardController = new DashboardController(configs, database);
    server.bind(dashboardController);

    /**
     * get list leads of campaign with type and campaignid
     */
    server.route({
        method: 'GET',
        path: '/dashboard/{userid}',
        config: {
            handler: dashboardController.dashboard,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Dashboard',
            validate: {
                params: {
                    userid: Joi.number().required().description('userid')
                },
                // headers: jwtValidator,
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
                            'description': 'Campaign .'
                        },
                        '404': {
                            'description': 'Campaign does not exists.'
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