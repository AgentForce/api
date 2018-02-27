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
const code_errors_1 = require("../../common/code-errors");
const nodemailer = require('nodemailer');
const EmailTemplate = require("email-templates");
const user_1 = require("../../postgres/user");
const faker = require("faker");
const index_2 = require("../../common/index");
const fs = require("fs");
const Loki = require("lokijs");
const db_1 = require("../../postgres/db");
const utils_1 = require("../../common/utils");
// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const fileOptions = { dest: `${UPLOAD_PATH}/`, fileFilter: utils_1.imageFilter };
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });
// optional: clean all data before start
// cleanFolder(UPLOAD_PATH);
if (!fs.existsSync(UPLOAD_PATH)) {
    // fs.mkdirSync(UPLOAD_PATH);
}
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
    uploadAvatar(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = request.payload;
                const files = data['photos'];
                const filesDetails = yield utils_1.uploader(files, fileOptions);
                const col = yield utils_1.loadCollection(COLLECTION_NAME, db);
                const result = [].concat(col.insert(filesDetails));
                db.saveDatabase();
                reply(result.map(x => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname })));
            }
            catch (err) {
                reply(Boom.badRequest(err.message, err));
            }
        });
    }
    /**
     * send mail
     */
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
                let randPass = faker.random.alphaNumeric(6);
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
                let res = {};
                if (request.payload.OldPassword === '123456') {
                    res = {
                        statusCode: 1,
                        data: {
                            status: true
                        },
                        msg: index_2.MsgCodeResponses.USER_CHANGE_PASS_SUCCESS,
                        msgCode: index_2.MsgCodeResponses.USER_CHANGE_PASS_SUCCESS
                    };
                }
                else {
                    res = {
                        statusCode: 1,
                        data: {
                            status: false
                        },
                        msg: index_2.MsgCodeResponses.USER_CHANGE_PASS_DONT_MATCH,
                        msgCode: index_2.MsgCodeResponses.USER_CHANGE_PASS_DONT_MATCH
                    };
                }
                reply(res);
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: {
                            code: 'ex',
                            msg: 'Exception occurred change password'
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
                reply(res);
            }
        });
    }
    setPassword(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        status: true
                    },
                    msgCode: index_2.MsgCodeResponses.USER_SET_PASSWORD_SUCCESS,
                    msg: index_2.MsgCodeResponses.USER_SET_PASSWORD_SUCCESS,
                };
                reply(res);
                // const dataInput = request.payload as IPayloadChangePass;
                // const username = request.params.username;
                // const user = <any>await UserService.findByCode(username);
                // if (user !== null) {
                //     if (Bcrypt.compareSync(dataInput.OldPassword, user.Password)) {
                //         let passwordHash = Bcrypt.hashSync(dataInput.NewPassword, Bcrypt.genSaltSync(8));
                //         let userPg: any = await UserService
                //             .changePassword(user.Id, dataInput, passwordHash);
                //         let userMongo: any = await this.database.userModel
                //             .update({
                //                 userId: user.Id,
                //             }, {
                //                 password: passwordHash
                //             });
                //         let res = {
                //             status: HTTP_STATUS.OK,
                //             url: request.url.path,
                //         };
                //         LogUser.create({
                //             type: 'changepassword',
                //             dataInput: {
                //                 params: request.params,
                //                 payload: request.payload
                //             },
                //             msg: 'change password success',
                //             meta: {
                //                 response: res
                //             }
                //         });
                //         reply(res).code(HTTP_STATUS.OK);
                //     } else {
                //         throw {
                //             code: Ex.EX_OLDPASSWORD_DONT_CORRECT,
                //             msg: 'oldpass dont correct'
                //         };
                //     }
                // } else {
                //     throw { code: Ex.EX_USERID_NOT_FOUND, msg: 'userid not found' };
                // }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 0,
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
                reply(res);
            }
        });
    }
    /**
     * User login
     */
    loginUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            return reply({
                status: 1,
                data: {
                    access_token: '2f8ac8b7255355afab238b45e9289d9504344ba5',
                    token_type: 'Bearer',
                    expires_in: 599,
                    refresh_token: 'ce4309b70cdc150de0e41295aa28009b65c42d26',
                    scope: 'user_info:read'
                },
                msgCode: '',
                msg: ''
            });
            // const username = request.payload.Username;
            // const password = request.payload.Password;
            // let user: IUser = await this.database
            //     .userModel
            //     .findOne({ username: username });
            // if (!user) {
            //     return reply({
            //         status: HTTP_STATUS.OK,
            //         token: Faker.random.alphaNumeric(250)
            //     });
            // }
            // if (!user.validatePassword(password)) {
            //     return reply(Boom.unauthorized("Password is invalid."));
            // }
            // let userPg = await UserService.findByCode(username);
            // reply({
            //     token: this.generateToken(user),
            //     info: userPg
            // });
        });
    }
    /**
   * User login
   */
    requestOTP(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            return reply({
                status: 1,
                data: {
                    Status: true
                },
                msg: index_2.MsgCodeResponses.USER_OTP_SUCCESS,
                msgCode: index_2.MsgCodeResponses.USER_OTP_SUCCESS
            });
            // const username = request.payload.Username;
            // const password = request.payload.Password;
            // let user: IUser = await this.database
            //     .userModel
            //     .findOne({ username: username });
            // if (!user) {
            //     return reply({
            //         status: HTTP_STATUS.OK,
            //         token: Faker.random.alphaNumeric(250)
            //     });
            // }
            // if (!user.validatePassword(password)) {
            //     return reply(Boom.unauthorized("Password is invalid."));
            // }
            // let userPg = await UserService.findByCode(username);
            // reply({
            //     token: this.generateToken(user),
            //     info: userPg
            // });
        });
    }
    testUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.db
                .query(`select * from reporttolist(${request.params.userid}, lquery_in('${request.params.query}'))`, { replacements: { email: 42 } })
                .spread((output, records) => {
                return records.rows;
            });
            // const username = request.payload.Username;
            // const password = request.payload.Password;
            // let user: IUser = await this.database
            //     .userModel
            //     .findOne({ username: username });
            // if (!user) {
            //     return reply({
            //         status: HTTP_STATUS.OK,
            //         token: Faker.random.alphaNumeric(250)
            //     });
            // }
            // if (!user.validatePassword(password)) {
            //     return reply(Boom.unauthorized("Password is invalid."));
            // }
            // let userPg = await UserService.findByCode(username);
            // reply({
            //     token: this.generateToken(user),
            //     info: userPg
            // });
        });
    }
    /**
    * Authentication
    */
    refreshToken(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    status: 1,
                    data: {
                        access_token: "9d22ef67c5ff1e6d6f7c06ca75267220951970d9",
                        token_type: "Bearer",
                        expires_in: 599,
                        refresh_token: "6e918eee79c9bf0d49e687ca7ff1848bc64d1f4f",
                        scope: "user_info:read"
                    },
                    msgCode: '',
                    msg: ''
                };
                reply(res).code(HTTP_STATUS.OK);
                // if (user !== null) {
                //     reply({
                //         status: HTTP_STATUS.OK,
                //         data: user
                //     }).code(HTTP_STATUS.OK);
                // } else {
                //     throw {
                //         code: Ex.EX_USERNAME_NOT_FOUND,
                //         msg: 'UserName not found'
                //     };
                // }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 1,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 1,
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
                reply(res);
            }
        });
    }
    profile(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = request.params.username;
                // const user = <any>await UserService.findByCode(username);
                console.log(request.params.hihi);
                let fakerUser = {
                    FullName: faker.name.firstName(),
                    Phone: '+841693248887',
                    Email: faker.internet.email(),
                    Credit: 10,
                    Gender: 'male',
                    Address: faker.address.city,
                    Code: '234234'
                };
                reply({
                    status: 1,
                    data: fakerUser
                });
                // if (user !== null) {
                //     reply({
                //         status: HTTP_STATUS.OK,
                //         data: user
                //     }).code(HTTP_STATUS.OK);
                // } else {
                //     throw {
                //         code: Ex.EX_USERNAME_NOT_FOUND,
                //         msg: 'UserName not found'
                //     };
                // }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 0,
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
                reply(res);
            }
        });
    }
    /**
     * update profile user
     */
    updateProfile(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fakerUser = {
                    FullName: faker.name.firstName(),
                    Phone: '+841693248887',
                    Email: faker.internet.email(),
                    Credit: 10,
                    Gender: 'male',
                    Address: faker.address.city,
                    Code: '234234'
                };
                reply({
                    status: 1,
                    data: fakerUser,
                    msg: 'Tìm thấy tài khoảng',
                    msgcode: 'found'
                }).code(HTTP_STATUS.OK);
            }
            catch (ex) {
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
                        status: 1,
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
                        status: 1,
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
                }
            }
        });
    }
    /**
    *  Check SMS OTP
    */
    verifyOTP(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {};
            try {
                if (request.payload.Code === '123456') {
                    res = {
                        statusCode: 1,
                        data: {
                            status: true
                        },
                        msg: '',
                        msgCode: ''
                    };
                    reply(res);
                }
                else {
                    res = {
                        statusCode: HTTP_STATUS.BAD_REQUEST,
                        data: {
                            status: false
                        }
                    };
                    reply(res);
                }
            }
            catch (ex) {
            }
        });
    }
    /**
   *  Check SMS OTP
   */
    check(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {
                statusCode: 1,
                data: {
                    status: 1
                },
                msg: '',
                msgCode: ''
            };
            if (request.params.phone === '841693248887' && request.params.username === 'm123456') {
                res = {
                    statusCode: 1,
                    data: {
                        status: 1
                    },
                    msg: index_2.MsgCodeResponses.USER_INACTIVE,
                    msgCode: index_2.MsgCodeResponses.USER_INACTIVE
                };
            }
            else if (request.params.phone === '841693248888' && request.params.username === 'm123455') {
                res = {
                    statusCode: 1,
                    data: {
                        status: 2
                    },
                    msg: index_2.MsgCodeResponses.USER_DONT_MATCH,
                    msgCode: index_2.MsgCodeResponses.USER_DONT_MATCH
                };
            }
            else if (request.params.phone === '841693248889' && request.params.username === 'd123456') {
                res = {
                    statusCode: 1,
                    data: {
                        status: 3
                    },
                    msg: index_2.MsgCodeResponses.USER_DEACTIVED,
                    msgCode: index_2.MsgCodeResponses.USER_DEACTIVED
                };
            }
            else if (request.params.phone === '841693248880' && request.params.username === 'a123456') {
                res = {
                    statusCode: 1,
                    data: {
                        status: 5
                    },
                    msg: index_2.MsgCodeResponses.USER_ACTIVED,
                    msgCode: index_2.MsgCodeResponses.USER_ACTIVED
                };
            }
            else {
                res = {
                    statusCode: 0,
                    data: {
                        status: 4
                    },
                    msg: index_2.MsgCodeResponses.USER_NOT_FOUND,
                    msgCode: index_2.MsgCodeResponses.USER_NOT_FOUND
                };
            }
            reply(res);
        });
    }
    /**
 *  Check SMS OTP
 */
    checkApp(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {
                statusCode: 1,
                data: {
                    active: 0,
                    description: "",
                    link: "",
                    mobile_type: request.params.type,
                    version: "3.0",
                },
                msgCode: '',
                msg: ''
            };
            reply(res);
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map