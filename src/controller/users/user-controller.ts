import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import { IUser } from "./user";
import { } from 'module';
import { IDatabase } from "../../database";
import { IIUser, UserService } from '../../services/user.service';
import { IServerConfigurations } from "../../configurations";
import * as Joi from 'joi';
import * as HTTP_STATUS from 'http-status';
import { LogUser } from "../../mongo/index";
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
                throw 'User do not exist';
            }
        } catch (error) {
            this.database.logModel.create({
                dataInput: request.payload,
                error: error,
                meta: {
                    // header: request.headers,
                    params: request.params,
                    auth: request.auth
                }
            });
            return reply({
                status: HTTP_STATUS.BAD_REQUEST,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


    public async createUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            const user = <any>await UserService.findByCode(dataInput.UserName);
            if (user == null) {

                let iUser: IIUser = dataInput;
                let newUserPg = <IIUser>await UserService.create(iUser);
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
                throw 'this code exist';
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