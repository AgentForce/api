import * as Hapi from "hapi";
import * as Joi from "joi";
import EventController from "./event-controller";
import * as CampaignValidator from "./event-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";


export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
    const eventController = new EventController(configs, database);
    server.bind(eventController);

    server.route({
        method: 'GET',
        path: '/events/userid/{userid}',
        config: {
            handler: eventController.findByUserId,
            // auth: "jwt",
            tags: ['api', 'events'],
            description: 'Get events by userid',
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
                            'description': 'event founded.'
                        },
                        '404': {
                            'description': 'events not found.'
                        }
                    }
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/events',
        config: {
            handler: eventController.create,
            // auth: "jwt",
            tags: ['api', 'events'],
            description: 'Create a event',
            validate: {
                payload: CampaignValidator.createModel,
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '201': {
                            'description': 'Created event'
                        }
                    }
                }
            }
        }
    });
}