import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import { IUser } from "./user";
import { } from 'module';
import { IDatabase } from "../../database";
import { IIUser, UserService as UserBll } from '../../services/user.service';
import { IServerConfigurations } from "../../configurations";
import * as Joi from 'joi';
import * as HTTP_STATUS from 'http-status';
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
        reply('hello');
    }


    public async createUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            const dataInput = request.payload;
            // const result = Joi.validate(request.request.body, createUserModel, {
            //     abortEarly: false
            // });
            const user = await UserBll.findByCode(dataInput.UserName)
                .catch(ex => {
                    throw ex;
                });

            if (user == null) {
                let newUser: any = await this.database.userModel.create({
                    email: dataInput.Email,
                    fullName: dataInput.FullName,
                    password: dataInput.Password
                });
                let iUser: IIUser = dataInput;
                let newUserPg = await UserBll.create(iUser)
                    .then()
                    .catch((error) => {
                        reply({
                            status: HTTP_STATUS.BAD_REQUEST,
                            errors: error
                        }).code(HTTP_STATUS.BAD_REQUEST);
                    });
                return reply({
                    token: this.generateToken(newUser)
                })
                    .code(201);
            } else {
                throw 'this code exist';
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