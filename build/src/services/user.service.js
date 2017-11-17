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
const postgres_1 = require("../postgres");
class UserService {
    static validate() {
    }
    /**
     * find User
     * @param id userid
     */
    static findByEmail(email) {
        return postgres_1.User
            .findOne({
            where: {
                Email: email
            }
        })
            .then(result => {
            return result;
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * find User
     * @param id userid
     */
    static findByCode(username) {
        return postgres_1.User
            .findOne({
            where: {
                UserName: username
            }
        })
            .then(result => {
            return result;
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * find User by id
     * @param id
     */
    static findById(id) {
        return postgres_1.User
            .findOne({
            where: {
                Id: id
            }
        })
            .then(result => {
            return result;
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * create new user
     * @param user IUser
     */
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.ReportToList = [];
            let parent = yield this.findById(user.ReportTo);
            if (parent == null) {
            }
            return postgres_1.User.create(user)
                .then(result => {
                return result;
            })
                .catch(ex => {
                throw ex;
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map