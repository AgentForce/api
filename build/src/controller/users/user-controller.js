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
const _index_1 = require("../../sqpg/_index");
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
    findUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let user = yield this.database
                    .userModel
                    .findOne({
                    email: email
                });
                resolve(user);
            }));
        });
    }
    createUser(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataInput = request.payload;
            const eUser = yield this.findUser(dataInput.email);
            if (eUser === null) {
                let user = yield this.database
                    .userModel
                    .create(request.payload);
                let userPsql = yield _index_1.default.User
                    .create(dataInput);
                return reply({
                    token: this.generateToken(user)
                })
                    .code(201);
            }
            else {
                return reply('user exists').code(200);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user-controller.js.map