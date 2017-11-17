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
const user_service_1 = require("./user.service");
class EventService {
    /**
     * list all event of userid
     * @param userId number
     */
    static findbyUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let events = yield postgres_1.Event.findAll({
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
     * Tạo mới event
     * @param lead IEvent
     */
    static create(mevent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield user_service_1.UserService.findById(mevent.UserId);
                if (user != null) {
                    mevent.ReportTo = user.ReportTo;
                    mevent.ReportToList = user.ReportToList;
                    let eventDb = yield postgres_1.Event.create(mevent);
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
exports.EventService = EventService;
//# sourceMappingURL=event.service.js.map