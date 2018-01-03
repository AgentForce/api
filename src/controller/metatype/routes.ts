import * as Hapi from "hapi";
import * as Joi from "joi";
import MetatypeController from "./metatype-controller";
import * as Metatypevalidate from "./metatype-validator";
import { jwtValidator } from "../users/user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";


export default function (server: Hapi.Server, configs: IServerConfigurations, database: IDatabase) {
    const metatypeController = new MetatypeController(configs, database);
    server.bind(metatypeController);


    server.route({
        method: 'GET',
        path: '/types/{type}',
        config: {
            handler: metatypeController.findByType,
            // auth: "jwt",
            tags: ['api', 'types'],
            description: 'Get types by type (Api support)',
            validate: {
                params: {
                    type: Joi.string().required()
                },
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'types founded.'
                        },
                        '404': {
                            'description': 'types not found.'
                        }
                    }
                }
            }
        }
    });



    server.route({
        method: 'POST',
        path: '/types',
        config: {
            handler: metatypeController.create,
            // auth: "jwt",
            tags: ['api', 'types'],
            description: 'create metatype (Api support)',
            validate: {
                payload: Metatypevalidate.createModel
                // headers: jwtValidator
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object(),
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    status: Joi
                                        .number()
                                        .example(404),
                                }
                            )
                        },
                    }
                }
            }
        }
    });


}