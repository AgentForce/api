import * as Hapi from "hapi";
import * as Joi from "joi";
import CampaignController from "./campaign-controller";
import * as CampaignValidator from "./campaign-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";

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
            description: 'Get Customer in a campaigns by id.',
            validate: {
                params: {
                    id: Joi.string().required().description('Campaignid'),
                    type: Joi.number().required().valid([1, 2, 3, 4]).description('4 processtep in lead')
                },
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
        method: 'GET',
        path: '/campaigns/{id}',
        config: {
            handler: campaignController.getByCampaignId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get campaign by campaignid.',
            validate: {
                params: {
                    id: Joi.string().required().description('campaignid')
                },
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

    // server.route({
    //     method: 'PUT',
    //     path: '/campaigns/{id}',
    //     config: {
    //         handler: campaignController.getByCampaignId,
    //         // auth: "jwt",
    //         tags: ['api', 'campaigns'],
    //         description: 'Update a campaign',
    //         validate: {
    //             params: {
    //                 id: Joi.string().required()
    //             },
    //             // headers: jwtValidator
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     200: {
    //                         'description': 'Campaign founded.'
    //                     },
    //                     404: {
    //                         'description': 'Campaign does not exists.'
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });



    server.route({
        method: 'GET',
        path: '/campaigns/userid/{userid}',
        config: {
            handler: campaignController.getByUserId,
            // auth: "jwt",
            tags: ['api', 'campaigns'],
            description: 'Get all campaigns by userid.',
            validate: {
                params: {
                    userid: Joi.string().required()
                },
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
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created campaign.'
                        }
                    }
                }
            }
        }
    });
}