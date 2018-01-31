"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const user_controller_1 = require("./user-controller");
const UserValidator = require("./user-validator");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const user_validator_1 = require("./user-validator");
const index_2 = require("../../common/index");
function default_1(server, serverConfigs, database) {
    const userController = new user_controller_1.default(serverConfigs, database);
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
        path: '/users/profile/{username}',
        config: {
            handler: userController.profile,
            // auth: "jwt",
            description: '#mockapi return info profile of a user',
            tags: ['api', 'users'],
            validate: {
                headers: UserValidator.headerModel,
                params: {
                    username: Joi.string().required()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
                        },
                        401: {
                            'description': 'Please login.',
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                                msgcode: Joi.string(),
                                msg: Joi.string()
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
                headers: user_validator_1.headerModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        error: {
                            code: 'ex_payload',
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    token: Joi.string().required(),
                                    refreshToken: Joi.string().required()
                                }),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
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
                headers: user_validator_1.headersChecksumModel,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        data: error,
                        msgCode: '',
                        msg: ''
                    };
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                status: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    Status: Joi.boolean()
                                }),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
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
        method: 'GET',
        path: '/users/check/{phone}/{username}',
        config: {
            handler: userController.check,
            // auth: "jwt",
            tags: ['api', 'users'],
            description: 'check user',
            validate: {
                headers: user_validator_1.headersChecksumModel,
                params: {
                    phone: Joi.string()
                        .default('841693248887')
                        .required(),
                    username: Joi.string()
                        .default('m123456')
                        .required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        error: {
                            code: 'ex_payload',
                            msg: 'payload dont valid',
                            details: error
                        }
                    };
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .valid([200, 400])
                                    .example(200),
                                data: Joi
                                    .object({
                                    status: Joi
                                        .number()
                                        .valid([1, 2, 3, 4, 5])
                                        .example(1)
                                        .description('1: chua active')
                                }),
                                msgcode: Joi.string(),
                                msg: Joi.string()
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
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object(),
                            })
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
                headers: user_validator_1.headerModel,
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
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    status: Joi
                                        .boolean()
                                        .example(true)
                                }),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(400),
                                data: Joi
                                    .object(),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
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
                headers: user_validator_1.headersChecksumModel,
                payload: {
                    Password: Joi.string()
                        .regex(/^[0-9]*$/)
                        .length(6).required()
                },
                failAction: (request, reply, source, error) => {
                    let res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST,
                        data: error,
                        msgCode: index_2.MsgCodeResponses.INPUT_INVALID,
                        msg: index_2.MsgCodeResponses.INPUT_INVALID
                    };
                    index_1.LogUser.create({
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
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi
                                    .object({
                                    status: Joi
                                        .boolean()
                                        .example(true)
                                }),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
                        },
                        400: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(400),
                                data: Joi
                                    .object({}),
                                msgcode: Joi.string(),
                                msg: Joi.string()
                            })
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
                headers: user_validator_1.headersChecksumModel,
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
                        data: error,
                        msgCode: index_2.MsgCodeResponses.INPUT_INVALID,
                        msg: index_2.MsgCodeResponses.INPUT_INVALID
                    };
                    return reply(res);
                }
            },
            plugins: {
                'hapi-swagger': {
                    // deprecated: true,
                    responses: {
                        200: {
                            description: 'success',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: Joi.object({
                                    Status: Joi
                                        .object({
                                        status: Joi.boolean()
                                    })
                                }),
                                msg: Joi.string().required(),
                                msgcode: Joi.string()
                            })
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
                headers: user_validator_1.headersChecksumModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: {
                                    access_token: Joi.string(),
                                    token_type: Joi.string(),
                                    expires_in: Joi.number(),
                                    refresh_token: Joi.string(),
                                    scope: Joi.string()
                                },
                                msg: Joi.string().required(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/users/refreshtoken',
        config: {
            handler: userController.refreshToken,
            tags: ['users', 'api'],
            description: 'refresh token, will return new token and new refresh token.',
            validate: {
                payload: {
                    refreshToken: Joi.string()
                },
                headers: user_validator_1.headersChecksumModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: {
                                    access_token: Joi.string(),
                                    token_type: Joi.string(),
                                    expires_in: Joi.number(),
                                    refresh_token: Joi.string(),
                                    scope: Joi.string()
                                },
                                msg: Joi.string().required(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                }
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/app/check',
        config: {
            handler: userController.checkApp,
            tags: ['app', 'api'],
            description: 'check update app',
            validate: {
                headers: user_validator_1.headersChecksumModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: '',
                            schema: Joi.object({
                                statusCode: Joi
                                    .number()
                                    .example(200),
                                data: {},
                                msg: Joi.string().required(),
                                msgcode: Joi.string()
                            })
                        },
                    },
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map