import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Jwt from "jsonwebtoken";
import { IUser } from "./user";
import { IDatabase } from "../../database";
import db from '../../sqpg/_index';
import { IServerConfigurations } from "../../configurations";

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

    private async findUser(email: string) {
        return new Promise(async (resolve, reject) => {
            let user: IUser = await this.database
                .userModel
                .findOne({ email: email });
            resolve(user);
        });
    }

    public async createUser(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        const dataInput = request.payload;
        const eUser = await this.findUser(dataInput.email);
        if (eUser === null) {
            let user: any = await this.database
                .userModel
                .create(request.payload);
            let userPsql = await db.User
                .create(dataInput);
            return reply({
                token: this.generateToken(user)
            })
                .code(201);
        } else {
            return reply('user exists').code(200);
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