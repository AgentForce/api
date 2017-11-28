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
const Jwt = require("jsonwebtoken");
const user_service_1 = require("../../services/user.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../helpers/code-errors");
const nodemailer = require('nodemailer');
const EmailTemplate = require("email-templates");
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
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
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
            let mailOptions = {
                from: '"Fred Foo 👻" <foo@blurdybloop.com>',
                to: 'tunguyenq@gmail.com',
                subject: 'Hello ✔',
                text: 'Hello world?',
                html: '<b>Hello world?</b>' // html body
            };
            const email = new EmailTemplate({
                message: {
                    from: '"Fred Foo 👻"  <tunguyene@gmail.com>'
                },
                // uncomment below to send emails in development/test env:
                // send: true
                transport: transporter,
            });
            email.send({
                template: 'resetpassword',
                message: {
                    to: 'tunguyenq@gmail.com'
                },
                locals: {
                    name: 'Tu Nguyen'
                }
            }).then(console.log).catch(console.error);
            reply('success');
            // send mail with defined transport object
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         return console.log(error);
            //     }
            //     reply('success');
            //     console.log('Message sent: %s', info.messageId);
            //     // Preview only available when sending through an Ethereal account
            //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            //     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            //     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            // });
        });
    }
    changePassword(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * User login
     */
    loginUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = request.payload.email;
            const password = request.payload.password;
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
                token: this.generateToken(user)
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
    createUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                const user = yield user_service_1.UserService.findByCode(dataInput.UserName);
                if (user == null) {
                    let iUser = dataInput;
                    let newUserPg = yield user_service_1.UserService.create(iUser);
                    let newUser = yield this.database.userModel
                        .create({
                        userId: newUserPg.Id,
                        email: dataInput.Email,
                        fullName: dataInput.FullName,
                        password: dataInput.Password
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
                    throw { code: code_errors_1.ManulifeErrors.EX_USERNAME_EXIST, msg: 'username exist' };
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
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map