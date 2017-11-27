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
const lead_1 = require("../postgres/lead");
const code_errors_1 = require("../helpers/code-errors");
class ActivityService {
    /**
    * Tìm một lead dựa vào số điện thoại
    * @param phone string
    */
    static findById(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lead = yield postgres_1.Activity.findOne({
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
     * Tạo mới activiy
     * @param activiy activiy
     */
    static create(payload) {
        return Promise.all([
            lead_1.Lead.findOne({
                where: {
                    Id: payload.LeadId,
                    CampId: payload.CampId,
                    IsDeleted: false,
                    UserId: payload.UserId
                }
            }),
            user_service_1.UserService.findById(payload.UserId)
        ])
            .then((results) => __awaiter(this, void 0, void 0, function* () {
            let lead = results[0];
            let user = results[1];
            if (lead == null) {
                throw { code: code_errors_1.ManulifeErrors.EX_LEADID_NOT_FOUND, msg: 'lead not found' };
            }
            if (user == null) {
                throw { code: code_errors_1.ManulifeErrors.EX_USERID_NOT_FOUND, msg: 'userid not found' };
            }
            let activity = {
                CampId: payload.CampId,
                Description: payload.Description,
                EndDate: payload.EndDate,
                Phone: lead.Phone,
                LeadId: lead.Id,
                Name: payload.ProcessStep.toString(),
                Type: lead.ProcessStep,
                ReportToList: user.ReportToList,
                FullDate: payload.FullDate,
                Location: payload.Location,
                Notification: payload.Notification,
                ReportTo: user.ReportTo,
                Status: 1,
                StartDate: payload.StartDate,
                ProcessStep: payload.ProcessStep,
                UserId: payload.UserId
            };
            let actDb = yield postgres_1.Activity.create(activity);
            return actDb;
        }))
            .catch(ex => {
            throw ex;
        });
    }
    /**
    * Update  activiy
    * @param activiy activiy
    */
    static update(activityId, payload) {
        return postgres_1.Activity
            .findOne({
            where: {
                Id: activityId,
                IsDeleted: false
            }
        })
            .then(activity => {
            if (activity == null) {
                throw {
                    code: code_errors_1.ManulifeErrors.EX_ACTIVITYID_NOT_FOUND,
                    msg: 'ActivityId not found'
                };
            }
            return postgres_1.Activity
                .update(payload, {
                where: {
                    Id: activityId
                },
                returning: true
            }).then(acDb => {
                return acDb[1];
            });
        })
            .catch(ex => {
            throw ex;
        });
    }
}
exports.ActivityService = ActivityService;
//# sourceMappingURL=activity.service.js.map