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
const lead_1 = require("../postgres/lead");
const activity_service_1 = require("./activity.service");
const bluebird_1 = require("bluebird");
const moment = require("moment");
const user_service_1 = require("./user.service");
class LeadService {
    /**
     * Tìm một lead dựa vào số điện thoại
     * @param phone string
     */
    static findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lead = yield lead_1.Lead.findOne({
                    where: {
                        Phone: phone,
                        IsDeleted: false
                    }
                });
                return lead;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
    * Tìm một lead dựa vào số điện thoại
    * @param phone string
    */
    static findById(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lead = yield lead_1.Lead.findOne({
                    where: {
                        Phone: phone,
                        IsDeleted: false
                    }
                });
                return lead;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Tạo mới lead sau đó sẽ tạo activity default cho lead này: default là hoạt động gọi
     * @param lead lead
     */
    static create(lead) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let existLead = yield this.findByPhone(lead.Phone);
            if (existLead == null) {
                let results = yield bluebird_1.Promise.all([
                    lead_1.Lead.create(lead),
                    user_service_1.UserService.findById(lead.UserId)
                ]);
                let leadDb = results[0];
                let userDb = results[1];
                let activity = {
                    CampId: leadDb.CampId,
                    Name: 'Call',
                    Phone: leadDb.Phone,
                    LeadId: leadDb.Id,
                    UserId: leadDb.UserId,
                    Type: 0,
                    Status: 0,
                    ProcessStep: 0,
                    Date: moment().toDate(),
                    ReportTo: userDb.ReportTo,
                    ReportToList: userDb.ReportToList
                };
                let activityDb = yield activity_service_1.ActivityService.create(activity)
                    .catch(ex => {
                    throw ex;
                });
                resolve({ lead: leadDb, activity: activityDb });
            }
            else {
                reject([3, 'Phone exist']);
            }
        }))
            .catch(ex => {
            throw ex;
        });
    }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map