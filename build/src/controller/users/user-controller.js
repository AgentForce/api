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
    createUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataInput = request.payload;
                // const result = Joi.validate(request.request.body, createUserModel, {
                //     abortEarly: false
                // });
                const user = yield user_service_1.UserService.findByCode(dataInput.UserName)
                    .catch(ex => {
                    throw ex;
                });
                if (user == null) {
                    let newUser = yield this.database.userModel.create({
                        email: dataInput.Email,
                        fullName: dataInput.FullName,
                        password: dataInput.Password
                    });
                    let iUser = dataInput;
                    let newUserPg = yield user_service_1.UserService.create(iUser)
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
                }
                else {
                    throw 'this code exist';
                }
            }
            catch (error) {
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
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map