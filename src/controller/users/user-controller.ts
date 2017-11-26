import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import { IUser, IPayloadCreate } from "./user";
import { } from 'module';
import { IDatabase } from "../../database";
import { IIUser, UserService } from '../../services/user.service';
import { IServerConfigurations } from "../../configurations";
import * as Joi from 'joi';
import * as HTTP_STATUS from 'http-status';
import { LogUser } from "../../mongo/index";
import { ManulifeErrors as Ex } from '../../helpers/code-errors';
import * as nodemailer from 'nodemailer';
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

    public sendMail(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
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
            let mailOptions = {
                from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
                to: 'tunguyenq@gmail.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                reply('success');
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        });
    }

    public async loginUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const email = request.payload.email;
        const password = request.payload.password;
        let user: IUser = await this.database
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
    }


    public async getByUsername(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const username = request.params.username;
            const user = <any>await UserService.findByCode(username);
            if (user !== null) {
                reply({
                    status: HTTP_STATUS.OK,
                    data: user
                }).code(HTTP_STATUS.OK);
            } else {
                throw { code: Ex.EX_USERNAME_NOT_FOUND, msg: 'UserName not found' };
            }
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: Ex.EX_GENERAL, msg: 'Exception occurred find username' }
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
    public async updateProfile(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            const user = <any>await UserService.findByCode(dataInput.UserName);
            if (user !== null) {
                let userMongo: any = await this.database.userModel
                    .update({
                        userId: user.Id,
                    }, {
                        fullName: dataInput.FullName,
                        email: dataInput.Email
                    });
                let userPg = await UserService
                    .updateProfile(user.Id, dataInput);

                reply({
                    status: HTTP_STATUS.OK,
                    data: userPg
                }).code(HTTP_STATUS.OK);
            } else {
                throw { code: Ex.EX_USERNAME_NOT_FOUND, msg: 'UserName not found' };
            }
        } catch (ex) {
            console.log(ex);
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'Exception occurred update profile user' }
                };
            }
            LogUser.create({
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
    }


    public async createUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            const user = <any>await UserService.findByCode(dataInput.UserName);
            if (user == null) {
                let iUser: IPayloadCreate = dataInput;
                let newUserPg = <any>await UserService.create(iUser);
                let newUser: any = await this.database.userModel
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
            } else {
                throw { code: Ex.EX_USERNAME_EXIST, msg: 'username exist' };
            }
        } catch (ex) {
            console.log(ex);
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: { code: 'ex', msg: 'Exception occurred create user' }
                };
            }
            LogUser.create({
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
    }

    /*public async updateUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = request.auth.credentials.id;

        try {
            let  user: IUser = await this.database.userModel.findByIdAndUpdate(id, { $set: request.payload }, { new: true });
            return reply(user);
        } catch (error) {
            return reply(Boom.badImplementation(error));
        }
    }

    public async deleteUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = request.auth.credentials.id;
        let user: IUser = await this.database.userModel.findByIdAndRemove(id);

        return reply(user);
    }

    public async infoUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const id = request.auth.credentials.id;
        let user: IUser = await this.database.userModel.findById(id);

        reply(user);
    }*/
}