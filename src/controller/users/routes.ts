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





    server.route({
        method: 'PUT',
        path: '/users/profile',
        config: {
            handler: userController.updateProfile,
            // auth: "jwt",
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
                    // deprecated: true,
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

    server.route({
        method: 'POST',
        path: '/users/otp/verify',
        config: {
            handler: userController.verifyOTP,
            // auth: "jwt",
            tags: ['api', 'users'],
            description: 'Verify SMS OTP',
            validate: {
                payload: UserValidator.verifyOTPModel,
                headers: Joi.object({
                    // authorization: Joi.string().required(),
                    // clientid: Joi.string().required()
                }).unknown(),
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
                    // deprecated: true,
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





    server.route({
        method: 'POST',
        path: '/users/check',
        config: {
            handler: userController.check,
            // auth: "jwt",
            tags: ['api', 'users'],
            description: 'check user',
            validate: {
                payload: {
                    Phone: Joi.string().required(),
                    UserName: Joi.string().required()
                },
                headers: Joi.object({
                    // authorization: Joi.string().required(),
                    // clientid: Joi.string().required()
                }).unknown(),
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
                    // deprecated: true,
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object({
                                            status: Joi
                                                .boolean()
                                                .example(true)
                                        }),
                                }
                            )
                        },
                        404: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(404),
                                    data: Joi
                                        .object({
                                            status: Joi
                                                .boolean()
                                                .example(false)
                                        }),
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
                                    statusCode: Joi
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
     * change password
     */
    server.route({
        method: 'PUT',
        path: '/users/changepassword',
        config: {
            handler: userController.changePassword,
            tags: ['api', 'users'],
            // auth: "jwt",
            description: 'Change password',
            validate: {
                payload: UserValidator.changePassModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST,
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
                    // deprecated: true,
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object({
                                            status: Joi
                                                .boolean()
                                                .example(true)
                                        }),
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(400),
                                    err: Joi
                                        .object({
                                            msg: Joi
                                                .string()
                                                .example('Password dont valid')
                                        }),
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
    * change password
    */
    server.route({
        method: 'PUT',
        path: '/users/setpassword',
        config: {
            handler: userController.setPassword,
            tags: ['api', 'users'],
            // auth: "jwt",
            description: 'Set password',
            validate: {
                payload: {
                    Password: Joi.string()
                        .regex(/^[0-9]*$/)
                        .length(6).required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST,
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
                    // deprecated: true,
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object({
                                            status: Joi
                                                .boolean()
                                                .example(true)
                                        }),
                                }
                            )
                        },
                        400: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(400),
                                    err: Joi
                                        .object({
                                            msg: Joi
                                                .string()
                                                .example('Password dont valid')
                                        }),
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
    * request otp
    */
    server.route({
        method: 'POST',
        path: '/users/opt/request',
        config: {
            handler: userController.requestOTP,
            tags: ['api', 'users'],
            // auth: "jwt",
            description: 'Request to get OTP code',
            validate: {
                payload: {
                    Phone: Joi
                        .string()
                        .example('+841693248887')
                        .required(),
                    UserName: Joi
                        .string()
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST,
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
                    // deprecated: true,
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
                                        .number()
                                        .example(200),
                                    data: Joi
                                        .object({
                                            status: Joi
                                                .boolean()
                                                .example(true)
                                        }),
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
                payload: UserValidator.loginUserModel,
                headers: Joi.object({ clientid: Joi.string().required() }).unknown()
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object(
                                {
                                    statusCode: Joi
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


}