import * as Hapi from "hapi";
import * as Joi from "joi";
import LeadController from "./lead-controller";
import * as CampaignValidator from "./lead-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";


export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
    const leadController = new LeadController(configs, database);
    server.bind(leadController);

    // server.route({
    //     method: 'GET',
    //     path: '/leads/{id}',
    //     config: {
    //         handler: leadController.getCampaignById,
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

    server.route({
        method: 'POST',
        path: '/leads',
        config: {
            handler: leadController.create,
            // auth: "jwt",
            tags: ['api', 'leads'],
            description: 'Create a leads.',
            validate: {
                payload: CampaignValidator.createLeadModel,
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created lead.'
                        }
                    }
                }
            }
        }
    });
}