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
const code_errors_1 = require("../common/code-errors");
class UserService {
    /**
     * Check if user exist
     */
    static findByUsernameEmail(username, email) {
        return postgres_1.User
            .findOne({
            where: {
                $or: [{
                        Email: email,
                    }, {
                        UserName: username
                    }
                ]
            }
        })
            .catch(ex => {
            throw ex;
        });
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
            },
            attributes: {
                exclude: ['IsDeleted']
            }
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
            .catch(ex => {
            throw ex;
        });
    }
    static updateProfile(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return postgres_1.User
                .update({
                Email: user.Email,
                Phone: user.Phone,
                FullName: user.FullName,
                Gender: user.Gender,
                Birthday: user.Birthday,
                Address: user.Address,
                City: user.City,
                District: user.District,
            }, {
                where: {
                    Id: id
                },
                returning: true,
            })
                .catch(ex => {
                throw ex;
            });
        });
    }
    static changePassword(id, payload, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return postgres_1.User
                .update({
                Password: passwordHash
            }, {
                where: {
                    Id: id
                },
                returning: true
            })
                .catch(ex => {
                throw ex;
            });
        });
    }
    /**
     * create new user
     * @param user IUser
     */
    static create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let ReportTo = null;
            if (payload.Manager != null) {
                let parent = yield this.findByCode(payload.Manager);
                if (parent == null) {
                    throw { code: code_errors_1.ManulifeErrors.EX_USERNAME_NOT_FOUND, msg: 'Username of manager not found' };
                }
                else {
                    ReportTo = parent.Id;
                }
            }
            // console.log(ReportTo);
            let user = {
                Address: payload.Address,
                Birthday: payload.Birthday,
                City: payload.City,
                UserName: payload.UserName,
                Email: payload.Email,
                FullName: payload.FullName,
                District: payload.District,
                Gender: payload.Gender,
                GroupId: payload.GroupId,
                Phone: payload.Phone,
                Password: payload.Password,
                ReportTo: ReportTo,
                ReportToList: '',
                Credit: 0
            };
            return postgres_1.User
                .create(user)
                .catch(ex => {
                throw ex;
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map