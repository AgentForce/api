import * as Hapi from "hapi";
import * as Joi from "joi";
import UserController from "./user-controller";
import { UserModel } from "./user";
import * as UserValidator from "./user-validator";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as HTTP_STATUS from 'http-status';
import { LogUser } from "../../mongo/index";
import { jwtValidator } from "./user-validator";
import { checkToken } from "../../common/authentication";
export default function (server: Hapi.Server, serverConfigs: IServerConfigurations, database: IDatabase) {

    const userController = new UserController(serverConfigs, database);
    server.bind(userController);
    server.route({
        method: 'GET',
        path: '/docs/{param*}',
        handler: {
            directory: {
                path: 'swagger-ui',
                listing: false
            }
        }
    });


    // server.route({
    //     method: 'GET',
    //     path: '/users/testdb',
    //     config: {
    //         handler: userController.testUser,
    //         auth: "jwt",
    //         description: 'Get user by username',
    //         tags: ['api', 'users'],
    //         validate: {
    //             // headers: UserValidator.jwtValidator,
    //             params: {
    //                 userid: Joi.string().required(),
    //                 query: Joi.string().required()
    //             }
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     200: {
    //                         description: '',
    //                         schema: Joi.object(
    //                             {
    //                                 status: Joi
    //                                     .number()
    //                                     .example(200),
    //                                 data: Joi
    //                                     .object(),
    //                             }
    //                         )
    //                     },
    //                     401: {
    //                         'description': 'Please login.',
    //                         schema: Joi.object({
    //                             "statusCode": 401,
    //                             "error": "Unauthorized",
    //                             "message": "Missing authentication"
    //                         })
    //                     }
    //                 },
    //                 security: [{
    //                     'jwt': []
    //                 }]
    //             }
    //         }
    //     }
    // });

    server.route({
        method: 'GET',
        path: '/users/profile',
        config: {
            handler: userController.profile,
            // auth: "jwt",
            description: '#mockapi return info profile of a user',
            tags: ['api', 'users'],
            validate: {
                // headers: UserValidator.jwtValidator,

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
                        401: {
                            'description': 'Please login.',
                            schema: Joi.object({
                                "statusCode": 401,
                                "error": "Unauthorized",
                                "message": "Missing authentication"
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


    /**
     * demo sendmail
     */
    server.route({
        method: 'POST',
        path: '/users/resetpassword',
        config: {
            handler: userController.sendMail,
            // auth: "jwt",
            tags: ['api', 'users'],
            description: 'send email(Just test, please dont try)',
            validate: {
                // headers: UserValidator.jwtValidator,
                payload: {
                    Email: Joi.string()
                        .email()
                        .required()
                        .example('tunguyenq@gmail.com')
                }
            },
            plugins: {
                'hapi-swagger': {
                    deprecated: true,
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
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });




    server.route({
        method: 'PUT',
        path: '/users/profile',
        config: {
            handler: userController.updateProfile,
            auth: "jwt",
            tags: ['api', 'users'],
            description: 'Update user profile.',
            validate: {
                payload: UserValidator.updateProfileModel,
                // headers: UserValidator.jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        error: {
                            code: 'ex_payload',
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogUser.create({
                        type: 'updateprofile',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    deprecated: true,
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
                        '401': {
                            'description': 'User does not have authorization.'
                        }
                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });

    /**
     * creat account manulife
     */
    server.route({
        method: 'POST',
        path: '/users',
        config: {
            handler: userController.createUser,
            tags: ['api', 'users'],
            description: 'Create a user of manulife',
            validate: {
                payload: UserValidator.createUserModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        error: {
                            code: 'ex_payload',
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogUser.create({
                        type: 'updateprofile',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    deprecated: true,
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
                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });
    /**
     * create account for resource
     */
    // server.route({
    //     method: 'POST',
    //     path: '/authen',
    //     config: {
    //         handler: userController.authorize,
    //         tags: ['api', 'users'],
    //         description: 'Create account for access resource',
    //         validate: {
    //             payload: UserValidator.ResourceModel,
    //             failAction: (request, reply, source, error) => {
    //                 let res = {
    //                     status: HTTP_STATUS.BAD_REQUEST,
    //                     error: {
    //                         code: 'ex_payload',
    //                         msg: 'payload dont valid',
    //                         details: error
    //                     }
    //                 };
    //                 LogUser.create({
    //                     type: 'updateprofile',
    //                     dataInput: request.payload,
    //                     msg: 'payload do not valid',
    //                     meta: {
    //                         exception: error,
    //                         response: res
    //                     },
    //                 });
    //                 return reply(res);
    //             }
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 deprecated: true,
    //                 responses: {
    //                     200: {
    //                         description: '',
    //                         schema: Joi.object(
    //                             {
    //                                 status: Joi
    //                                     .number()
    //                                     .example(200),
    //                                 data: Joi
    //                                     .object(),
    //                             }
    //                         )
    //                     },
    //                 },
    //                 security: [{
    //                     'jwt': []
    //                 }]
    //             }
    //         }
    //     }
    // });

    /**
     * change password
     */
    server.route({
        method: 'POST',
        path: '/users/changepassword/{username}',
        config: {
            handler: userController.changePassword,
            tags: ['api', 'users'],
            auth: "jwt",
            description: 'Change password',
            validate: {
                params: {
                    username: Joi.string().required()
                        .description('username')
                },
                payload: UserValidator.changePassModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        error: {
                            code: 'ex_payload',
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    LogUser.create({
                        type: 'changepassword',
                        dataInput: request.payload,
                        msg: 'payload do not valid',
                        meta: {
                            exception: error,
                            response: res
                        },
                    });
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    deprecated: true,
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
                    },
                    security: [{
                        'jwt': []
                    }]
                }
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/users/login',
        config: {
            handler: userController.loginUser,
            tags: ['users', 'api'],
            description: '#mockapi Login a user.',
            validate: {
                payload: UserValidator.loginUserModel
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
                                    token: Joi
                                        .string()
                                        .required(),
                                }
                            )
                        },
                    },
                }
            }
        }
    });

    /**
     * login authorize
     */
    // server.route({
    //     method: 'POST',
    //     path: '/authen/login',
    //     config: {
    //         handler: userController.loginAuthen,
    //         tags: ['users', 'api'],
    //         description: 'Authentication.',
    //         validate: {
    //             payload: UserValidator.loginResourceModel
    //         },
    //         plugins: {
    //             'hapi-swagger': {
    //                 responses: {
    //                     200: {
    //                         description: '',
    //                         schema: Joi.object(
    //                             {
    //                                 status: Joi
    //                                     .number()
    //                                     .example(200),
    //                                 token: Joi
    //                                     .string()
    //                                     .required(),
    //                             }
    //                         )
    //                     },
    //                 },
    //             }
    //         }
    //     }
    // });
}