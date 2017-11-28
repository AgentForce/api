"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const user_controller_1 = require("./user-controller");
const UserValidator = require("./user-validator");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const user_validator_1 = require("./user-validator");
function default_1(server, serverConfigs, database) {
    const userController = new user_controller_1.default(serverConfigs, database);
    server.bind(userController);
    server.route({
        method: 'GET',
        path: '/users/{username}',
        config: {
            handler: userController.getByUsername,
            // auth: "jwt",
            description: 'Get user by username.',
            tags: ['api', 'users'],
            validate: {
                // headers: UserValidator.jwtValidator,
                params: {
                    username: Joi.string().required()
                }
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User founded.'
                        },
                        '401': {
                            'description': 'Please login.'
                        }
                    }
                }
            }
        }
    });
    /**
     * demo sendmail
     */
    server.route({
        method: 'GET',
        path: '/users/sendmail',
        config: {
            handler: userController.sendMail,
            // auth: "jwt",
            tags: ['api', 'users'],
            description: 'send email(Just test, please dont try)',
            validate: {},
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User founded.'
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
        method: 'GET',
        path: '/swagger/{param*}',
        handler: {
            directory: {
                path: 'swagger-ui',
                listing: false
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
                headers: UserValidator.jwtValidator,
                failAction: (request, reply, source, error) => {
                    let res = {
                        status: HTTP_STATUS.BAD_REQUEST, error: {
                            code: 'ex_payload', msg: 'payload dont valid',
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
                    responses: {
                        '200': {
                            'description': 'Updated info.',
                        },
                        '401': {
                            'description': 'User does not have authorization.'
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/users',
        config: {
            handler: userController.createUser,
            tags: ['api', 'users'],
            description: 'Create a user.',
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
                    responses: {
                        '200': {
                            'description': 'User created.'
                        }
                    }
                }
            }
        }
    });
    /**
     * change password
     */
    server.route({
        method: 'POST',
        path: '/users/changepassword/{id}',
        config: {
            handler: userController.createUser,
            tags: ['api', 'users'],
            auth: "jwt",
            description: 'Change password',
            validate: {
                headers: user_validator_1.jwtValidator,
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
                    responses: {
                        '200': {
                            'description': 'change password success'
                        }
                    }
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
            description: 'Login a user.',
            validate: {
                payload: UserValidator.loginUserModel
            },
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '200': {
                            'description': 'User logged in.'
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=routes.js.map