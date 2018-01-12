"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const dashboard_controller_1 = require("./dashboard-controller");
const HTTP_STATUS = require("http-status");
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
        path: '/dashboard/{userid}',
        config: {
            handler: dashboardController.dashboard,
            auth: "jwt",
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
                            code: code_errors_1.ManulifeErrors.EX_PAYLOAD,
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogCamp.create({
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
exports.default = default_1;
//# sourceMappingURL=routes.js.map