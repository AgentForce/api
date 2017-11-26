import * as Hapi from "hapi";
import * as Joi from "joi";
import ActivityController from "./activity-controller";
import * as ActivitiesValidator from "./activity-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { LogActivity } from "../../mongo/index";
export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {

    const activitiesController = new ActivityController(configs, database);
    server.bind(activitiesController);




    // /**
    //  * lấy 1 campaign theo campaignid
    //  */
    // server.route({
    //     method: 'GET',
    //     path: '/campaigns/{id}',
    //     config: {
    //         handler: campaignController.getCampaignById,
    //         auth: "jwt",
    //         tags: ['api', 'campaigns'],
    //         description: 'Get campaigns by id.',
    //         validate: {
    //             params: {
    //                 id: Joi.string().required()
    //             },
    //             headers: jwtValidator
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


    /**
     * Tạo mới goal
     */
    server.route({
        method: 'POST',
        path: '/activities',
        config: {
            handler: activitiesController.create,
            // auth: "jwt",
            tags: ['api', 'activities'],
            description: 'Create a activity.',
            validate: {
                payload: ActivitiesValidator.createModel,
                // headers: jwtValidator
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: 'ex_payload', msg: 'payload dont valid',
                            details: error
                        }
                    };
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
                        201: {
                            'description': 'activity created.'
                        }
                    }
                }
            }
        }
    });
}