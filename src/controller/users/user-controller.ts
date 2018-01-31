import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Bcrypt from 'bcryptjs';
import * as Jwt from "jsonwebtoken";
import { IUser, IPayloadCreate, IPayloadChangePass } from "./user";
import { } from 'module';
import { IDatabase } from "../../database";
import { IIUser, UserService } from '../../services/user.service';
import { IServerConfigurations } from "../../configurations";
import * as Joi from 'joi';
import * as HTTP_STATUS from 'http-status';
import { LogUser } from "../../mongo/index";
import { ManulifeErrors as Ex } from '../../common/code-errors';
const nodemailer = require('nodemailer');
import * as EmailTemplate from 'email-templates';
import { User } from "../../postgres/user";
import * as faker from 'faker';
import { SlackAlert, MsgCodeResponses, MsgResponses } from "../../common/index";

import * as path from 'path';
import * as fs from 'fs';
import * as Loki from 'lokijs';

import { db as dbPostgres } from '../../postgres/db';


import {
    imageFilter, loadCollection, cleanFolder,
    uploader
} from '../../common/utils';

// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const fileOptions: FileUploaderOption = { dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter };
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });

// optional: clean all data before start
// cleanFolder(UPLOAD_PATH);
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH);
}

export default class UserController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.database = database;
        this.configs = configs;
    }

    private generateToken(user: IUser) {
        const jwtSecret = this.configs.jwtSecret;
        const jwtExpiration = this.configs.jwtExpiration;
        const payload = { id: user._id };
        return Jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });
    }

    public async uploadAvatar(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const data = request.payload;
            const files = data['photos'];

            const filesDetails = await uploader(files, fileOptions);
            const col = await loadCollection(COLLECTION_NAME, db);
            const result = [].concat(col.insert(filesDetails));

            db.saveDatabase();
            reply(result.map(x => ({ id: x.$loki, fileName: x.filename, originalName: x.originalname })));
        } catch (err) {
            reply(Boom.badRequest(err.message, err));
        }
    }
    /**
     * send mail
     */
    public async sendMail(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {


        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        try {
            let user = <any>await UserService.findByEmail(request.payload.Email);
            let res = {};
            if (user === null) {
                res = {
                    code: Ex.EX_USER_EMAIL_NOT_EXIST,
                    msg: 'reset password: email not exist',
                    email: request.payload.Email
                };
                SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                reply(res).code(HTTP_STATUS.BAD_GATEWAY);
            }
            let randPass = faker.random.alphaNumeric(6);
            let passwordHash = Bcrypt.hashSync(randPass, Bcrypt.genSaltSync(8));
            let userPg: any = await User
                .update({
                    Password: passwordHash,
                }, {
                    where: {
                        Email: request.payload.Email
                    }
                });

            let userMongo: any = await this.database.userModel
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
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'postmaster@sandbox44fcddb06ee648bab11ed2d961948e16.mailgun.org', // generated ethereal user
                        pass: 'b8a3360741b54181a34716645f452fee'  // generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                const email = new EmailTemplate({
                    message: {
                        from: '"Manulife" <apimanulife@gmail.com>', // sender address
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
                LogUser.create({
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
        } catch (ex) {
            LogUser.create({
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
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            reply(res).code(HTTP_STATUS.OK);
        }
    }


    public async changePassword(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {

            };
            if (request.payload.OldPassword === '123456') {
                res = {
                    statusCode: 200,
                    data: {
                        status: true
                    },
                    msg: MsgCodeResponses.USER_CHANGE_PASS_SUCCESS,
                    msgCode: MsgCodeResponses.USER_CHANGE_PASS_SUCCESS
                };
            } else {
                res = {
                    statusCode: 200,
                    data: {
                        status: false
                    },
                    msg: MsgCodeResponses.USER_CHANGE_PASS_DONT_MATCH,
                    msgCode: MsgCodeResponses.USER_CHANGE_PASS_DONT_MATCH
                };
            }
            reply(res);

        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: 'ex',
                        msg:
                            'Exception occurred change password'
                    }
                };
            }
            LogUser.create({
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
    }

    public async setPassword(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: {
                    status: true
                },
                msgCode: MsgCodeResponses.USER_SET_PASSWORD_SUCCESS,
                msg: MsgCodeResponses.USER_SET_PASSWORD_SUCCESS,
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
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: 'ex', msg:
                            'Exception occurred change password'
                    }
                };
            }
            LogUser.create({
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
    }

    /**
     * User login
     */
    public async loginUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        return reply({
            status: HTTP_STATUS.OK,
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
    }

    /**
   * User login
   */
    public async requestOTP(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        return reply({
            status: HTTP_STATUS.OK,
            data: {
                Status: true
            },
            msg: MsgCodeResponses.USER_OTP_SUCCESS,
            msgCode: MsgCodeResponses.USER_OTP_SUCCESS
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
    }


    public async testUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        return dbPostgres
            .query(`select * from reporttolist(${request.params.userid}, lquery_in('${request.params.query}'))`,
            { replacements: { email: 42 } })
            .spread((output, records: any) => {
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
    }
    /**
    * Authentication
    */
    public async refreshToken(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                status: HTTP_STATUS.OK,
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
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: Ex.EX_GENERAL,
                        msg: 'Exception occurred find username'
                    }
                };
            }
            LogUser.create({
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
    }


    public async profile(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
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
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: Ex.EX_GENERAL,
                        msg: 'Exception occurred find username'
                    }
                };
            }
            LogUser.create({
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
    }

    /**
     * update profile user
     */
    public async updateProfile(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
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
                data: fakerUser,
                msg: 'Tìm thấy tài khoảng',
                msgcode: 'found'
            }).code(HTTP_STATUS.OK);

        } catch (ex) {

        }
    }

    /**
     *  Create new user
     */
    public async createUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            const user = <any>await UserService.findByUsernameEmail(dataInput.UserName, dataInput.Email);
            const userMongo = <any>await this.database.userModel
                .findOne({
                    where: { email: dataInput.Email }
                });
            if (user == null && userMongo == null) {
                let iUser: IPayloadCreate = dataInput;
                let passwordHash = Bcrypt.hashSync(dataInput.Password, Bcrypt.genSaltSync(8));
                iUser.Password = passwordHash;
                let newUserPg = <any>await UserService.create(iUser);
                let newUser: any = await this.database.userModel
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
            } else {
                throw { code: Ex.EX_USERNAME_EXIST, msg: 'username exist or email exist' };
            }
        } catch (ex) {

        }
    }

    /**
     *  create account resource for use api
     */
    public async authorize(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            const user = <any>await this.database.userModel
                .findOne({
                    where: { email: dataInput.Email }
                });
            if (user == null) {
                let passwordHash = Bcrypt.hashSync(dataInput.Password, Bcrypt.genSaltSync(8));
                let newUser: any = await this.database.userModel
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
            } else {
                throw { code: Ex.EX_EMAIL_AUTHORIZE_EXIST, msg: 'email exist' };
            }
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {

            }
        }
    }

    /**
    *  Check SMS OTP
    */
    public async verifyOTP(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
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

            } else {
                res = {
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                    data: {
                        status: false
                    }
                };
                reply(res).code(HTTP_STATUS.BAD_REQUEST);

            }

        } catch (ex) {

        }
    }


    /**
   *  Check SMS OTP
   */
    public async check(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let res = {
            statusCode: 200,
            data: {
                status: 1
            },
            msg: '',
            msgCode: ''
        };
        if (request.params.phone === '841693248887' && request.params.username === 'm123456') {
            res = {
                statusCode: 200,
                data: {
                    status: 1
                },
                msg: MsgCodeResponses.USER_INACTIVE,
                msgCode: MsgCodeResponses.USER_INACTIVE
            };
        } else if (request.params.phone === '841693248888' && request.params.username === 'm123455') {
            res = {
                statusCode: 200,
                data: {
                    status: 2
                },
                msg: MsgCodeResponses.USER_DONT_MATCH,
                msgCode: MsgCodeResponses.USER_DONT_MATCH
            };
        } else if (request.params.phone === '841693248889' && request.params.username === 'd123456') {
            res = {
                statusCode: 200,
                data: {
                    status: 3
                },
                msg: MsgCodeResponses.USER_DEACTIVED,
                msgCode: MsgCodeResponses.USER_DEACTIVED
            };
        } else if (request.params.phone === '841693248880' && request.params.username === 'a123456') {
            res = {
                statusCode: 200,
                data: {
                    status: 5
                },
                msg: MsgCodeResponses.USER_ACTIVED,
                msgCode: MsgCodeResponses.USER_ACTIVED
            };
        } else {
            res = {
                statusCode: 200,
                data: {
                    status: 4
                },
                msg: MsgCodeResponses.USER_NOT_FOUND,
                msgCode: MsgCodeResponses.USER_NOT_FOUND
            };

        }
        reply(res);
    }

    /**
 *  Check SMS OTP
 */
    public async checkApp(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let res = {
            statusCode: 200,
            data: {
                active: 0,
                description: "",
                link: "",
                mobile_type: "android",
                version: "3.0",
            },
            msgCode: '',
            msg: ''
        };

        reply(res);
    }
}