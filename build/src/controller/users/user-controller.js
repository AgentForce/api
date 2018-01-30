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
    fs.mkdirSync(UPLOAD_PATH);
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
                let res = {
                    statusCode: 200,
                    data: {
                        status: true
                    },
                    msg: '',
                    msgCode: ''
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    setPassword(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 200,
                    data: {
                        status: true
                    },
                    msgCode: '',
                    msg: ''
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
            return reply({
                status: HTTP_STATUS.OK,
                data: {
                    token: '#manulife$123$123',
                    refreshToken: '3453p04tertvnw34[5'
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
                status: HTTP_STATUS.OK,
                data: {
                    Code: '123456'
                },
                msg: '',
                msgCode: ''
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
                    status: HTTP_STATUS.OK,
                    data: {
                        token: '#manulife$123$123',
                        refreshToken: '3453p04tertvnw34[5'
                    },
                    msgCode: '',
                    msg: ''
                };
                reply({
                    status: HTTP_STATUS.OK,
                    data: res
                }).code(HTTP_STATUS.OK);
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
                    status: HTTP_STATUS.OK,
                    data: fakerUser
                }).code(HTTP_STATUS.OK);
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
                    status: HTTP_STATUS.OK,
                    data: fakerUser
                }).code(HTTP_STATUS.OK);
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
    /**
    *  Check SMS OTP
    */
    verifyOTP(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {};
            try {
                if (request.payload.Code === '123456') {
                    res = {
                        statusCode: 200,
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
                    reply(res).code(HTTP_STATUS.BAD_REQUEST);
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
    /**
   *  Check SMS OTP
   */
    check(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {};
            try {
                res = {
                    statusCode: 200,
                    data: {
                        status: 1
                    },
                    msg: '',
                    msgCode: ''
                };
                reply(res);
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