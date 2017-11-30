"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Boom = require("boom");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const user_service_1 = require("../../services/user.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../helpers/code-errors");
const nodemailer = require('nodemailer');
const EmailTemplate = require("email-templates");
const user_1 = require("../../postgres/user");
const Faker = require("faker");
const index_2 = require("../../helpers/index");
class UserController {
    constructor(configs, database) {
        this.database = database;
        this.configs = configs;
    }
    generateToken(user) {
        const jwtSecret = this.configs.jwtSecret;
        const jwtExpiration = this.configs.jwtExpiration;
        const payload = { id: user._id };
        return Jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
    }
    sendMail(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            try {
                let user = yield user_service_1.UserService.findByEmail(request.payload.Email);
                let res = {};
                if (user === null) {
                    res = {
                        code: code_errors_1.ManulifeErrors.EX_USER_EMAIL_NOT_EXIST,
                        msg: 'reset password: email not exist',
                        email: request.payload.Email
                    };
                    index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                    reply(res).code(HTTP_STATUS.BAD_GATEWAY);
                }
                let randPass = Faker.random.alphaNumeric(6);
                let passwordHash = Bcrypt.hashSync(randPass, Bcrypt.genSaltSync(8));
                let userPg = yield user_1.User
                    .update({
                    Password: passwordHash,
                }, {
                    where: {
                        Email: request.payload.Email
                    }
                });
                let userMongo = yield this.database.userModel
                    .update({
                    email: request.payload.Email,
                }, {
                    password: passwordHash
                });
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.mailgun.org',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'postmaster@sandbox44fcddb06ee648bab11ed2d961948e16.mailgun.org',
                            pass: 'b8a3360741b54181a34716645f452fee' // generated ethereal password
                        }
                    });
                    // setup email data with unicode symbols
                    const email = new EmailTemplate({
                        message: {
                            from: '"Manulife" <apimanulife@gmail.com>',
                        },
                        // uncomment below to send emails in development/test env:
                        // send: true
                        transport: transporter,
                    });
                    email.send({
                        template: 'resetpassword',
                        message: {
                            to: user.Email
                        },
                        locals: {
                            name: user.FullName,
                            password: randPass
                        }
                    }).then(console.log);
                    res = {
                        msg: 'send email reset password success',
                        status: HTTP_STATUS.OK
                    };
                    index_1.LogUser.create({
                        type: 'changepassword',
                        dataInput: {
                            params: request.params,
                            payload: request.payload
                        },
                        msg: 'change password success',
                        meta: {
                            response: res
                        }
                    });
                    reply(res).code(HTTP_STATUS.OK);
                });
            }
            catch (ex) {
                index_1.LogUser.create({
                    type: 'changepassword',
                    dataInput: {
                        params: request.params,
                        payload: request.payload
                    },
                    msg: 'change password success',
                    meta: {
                        exception: ex
                    }
                });
                let res = {
                    status: HTTP_STATUS.BAD_GATEWAY,
                    msg: 'Reset email have error',
                    email: request.payload.Email
                };
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                reply(res).code(HTTP_STATUS.OK);
            }
        });
    }
    changePassword(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                const username = request.params.username;
                const user = yield user_service_1.UserService.findByCode(username);
                if (user !== null) {
                    if (Bcrypt.compareSync(dataInput.OldPassword, user.Password)) {
                        let passwordHash = Bcrypt.hashSync(dataInput.NewPassword, Bcrypt.genSaltSync(8));
                        let userPg = yield user_service_1.UserService
                            .changePassword(user.Id, dataInput, passwordHash);
                        let userMongo = yield this.database.userModel
                            .update({
                            userId: user.Id,
                        }, {
                            password: passwordHash
                        });
                        let res = {
                            status: HTTP_STATUS.OK,
                            url: request.url.path,
                        };
                        index_1.LogUser.create({
                            type: 'changepassword',
                            dataInput: {
                                params: request.params,
                                payload: request.payload
                            },
                            msg: 'change password success',
                            meta: {
                                response: res
                            }
                        });
                        reply(res).code(HTTP_STATUS.OK);
                    }
                    else {
                        throw {
                            code: code_errors_1.ManulifeErrors.EX_OLDPASSWORD_DONT_CORRECT,
                            msg: 'oldpass dont correct'
                        };
                    }
                }
                else {
                    throw { code: code_errors_1.ManulifeErrors.EX_USERID_NOT_FOUND, msg: 'userid not found' };
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: 'ex', msg: 'Exception occurred change password'
                        }
                    };
                }
                index_1.LogUser.create({
                    type: 'changepassword',
                    dataInput: request.payload,
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     * User login
     */
    loginUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = request.payload.Username;
            const password = request.payload.Password;
            let user = yield this.database
                .userModel
                .findOne({ username: username });
            if (!user) {
                return reply(Boom.unauthorized("User does not exists."));
            }
            if (!user.validatePassword(password)) {
                return reply(Boom.unauthorized("Password is invalid."));
            }
            let userPg = yield user_service_1.UserService.findByCode(username);
            reply({
                token: this.generateToken(user),
                info: userPg
            });
        });
    }
    /**
    * Authentication
    */
    loginAuthen(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = request.payload.Email;
            const password = request.payload.Password;
            let user = yield this.database
                .userModel
                .findOne({ email: email });
            if (!user) {
                return reply(Boom.unauthorized("User does not exists."));
            }
            if (!user.validatePassword(password)) {
                return reply(Boom.unauthorized("Password is invalid."));
            }
            reply({
                token: this.generateToken(user),
            });
        });
    }
    getByUsername(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = request.params.username;
                const user = yield user_service_1.UserService.findByCode(username);
                if (user !== null) {
                    reply({
                        status: HTTP_STATUS.OK,
                        data: user
                    }).code(HTTP_STATUS.OK);
                }
                else {
                    throw {
                        code: code_errors_1.ManulifeErrors.EX_USERNAME_NOT_FOUND,
                        msg: 'UserName not found'
                    };
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'Exception occurred find username'
                        }
                    };
                }
                index_1.LogUser.create({
                    type: 'findusername',
                    dataInput: {
                        params: request.params
                    },
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     * update profile user
     */
    updateProfile(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                const user = yield user_service_1.UserService.findByCode(dataInput.UserName);
                if (user !== null) {
                    let userMongo = yield this.database.userModel
                        .update({
                        userId: user.Id,
                    }, {
                        fullName: dataInput.FullName,
                        email: dataInput.Email
                    });
                    let userPg = yield user_service_1.UserService
                        .updateProfile(user.Id, dataInput);
                    reply({
                        status: HTTP_STATUS.OK,
                        data: userPg
                    }).code(HTTP_STATUS.OK);
                }
                else {
                    throw { code: code_errors_1.ManulifeErrors.EX_USERNAME_NOT_FOUND, msg: 'UserName not found' };
                }
            }
            catch (ex) {
                console.log(ex);
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: { code: 'ex', msg: 'Exception occurred update profile user' }
                    };
                }
                index_1.LogUser.create({
                    type: 'updateprofile',
                    dataInput: request.payload,
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     *  Create new user
     */
    createUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                const user = yield user_service_1.UserService.findByUsernameEmail(dataInput.UserName, dataInput.Email);
                const userMongo = yield this.database.userModel
                    .findOne({
                    where: { email: dataInput.Email }
                });
                if (user == null && userMongo == null) {
                    let iUser = dataInput;
                    let passwordHash = Bcrypt.hashSync(dataInput.Password, Bcrypt.genSaltSync(8));
                    iUser.Password = passwordHash;
                    let newUserPg = yield user_service_1.UserService.create(iUser);
                    let newUser = yield this.database.userModel
                        .create({
                        userId: newUserPg.Id,
                        email: dataInput.Email,
                        fullName: dataInput.FullName,
                        username: dataInput.UserName,
                        password: passwordHash
                    })
                        .catch(ex => {
                        console.log(ex);
                    });
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: {
                            token: this.generateToken(newUser),
                            info: newUserPg
                        }
                    })
                        .code(HTTP_STATUS.OK);
                }
                else {
                    throw { code: code_errors_1.ManulifeErrors.EX_USERNAME_EXIST, msg: 'username exist or email exist' };
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'Exception occurred create user'
                        }
                    };
                }
                index_1.LogUser.create({
                    type: 'createuser',
                    dataInput: request.payload,
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     *  create account resource for use api
     */
    authorize(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                const user = yield this.database.userModel
                    .findOne({
                    where: { email: dataInput.Email }
                });
                if (user == null) {
                    let passwordHash = Bcrypt.hashSync(dataInput.Password, Bcrypt.genSaltSync(8));
                    let newUser = yield this.database.userModel
                        .create({
                        userId: -1,
                        username: dataInput.Email,
                        email: dataInput.Email,
                        fullName: dataInput.FullName,
                        password: passwordHash
                    })
                        .catch(ex => {
                        throw ex;
                    });
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: {
                            token: this.generateToken(newUser)
                        }
                    })
                        .code(HTTP_STATUS.OK);
                }
                else {
                    throw { code: code_errors_1.ManulifeErrors.EX_EMAIL_AUTHORIZE_EXIST, msg: 'email exist' };
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'Exception occurred create authorize'
                        }
                    };
                }
                index_1.LogUser.create({
                    type: 'createauthorize',
                    dataInput: request.payload,
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map