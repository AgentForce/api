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
const user_service_1 = require("./user.service");
const invite_1 = require("../postgres/invite");
class InviteService {
    /**
     * list all invite of userid
     * @param userId number
     */
    static findbyUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let events = yield invite_1.Invite.findAll({
                    where: {
                        UserId: userId,
                        IsDeleted: false
                    }
                });
                return events;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * get invite by id
     * @param id number
     */
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let events = yield invite_1.Invite.findAll({
                    where: {
                        Id: id,
                        IsDeleted: false
                    }
                });
                return events;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Tạo mới invite
     * @param invite IIvite
     */
    static create(mevent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield user_service_1.UserService.findById(mevent.UserId);
                if (user != null) {
                    mevent.ReportTo = user.ReportTo;
                    mevent.ReportToList = user.ReportToList;
                    let eventDb = yield invite_1.Invite.create(mevent);
                    return eventDb;
                }
                else {
                    throw [4, 'userid not found'];
                }
            }
            catch (ex) {
                throw ex;
            }
        });
    }
}
exports.InviteService = InviteService;
//# sourceMappingURL=invite.service.js.map