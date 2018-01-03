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
const campaign_service_1 = require("./campaign.service");
const code_errors_1 = require("../helpers/code-errors");
const activity_1 = require("../postgres/activity");
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
    * Tìm một lead dựa vào Id
    * @param phone string
    */
    static findById(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lead = yield lead_1.Lead.findOne({
                    where: {
                        Id: Id,
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
    static detailLeadActivity(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            return lead_1.Lead
                .findOne({
                where: {
                    Id: Id,
                    IsDeleted: false
                },
                include: [{
                        model: activity_1.Activity,
                        attributes: {
                            exclude: ['IsDeleted']
                        }
                    }]
            })
                .then(lead => {
                return lead;
            });
        });
    }
    static update(leadId, lead) {
        return __awaiter(this, void 0, void 0, function* () {
            return this
                .findById(leadId)
                .then((leadDb) => {
                if (leadDb == null) {
                    throw { code: code_errors_1.ManulifeErrors.EX_LEADID_NOT_FOUND, msg: 'Lead not found' };
                }
                if (leadDb.ProcessStep > lead.ProcessStep) {
                    throw { code: code_errors_1.ManulifeErrors.EX_LEAD_PROCESS_STEP, msg: 'cant not update processtep < old processtep' };
                }
                return lead_1.Lead
                    .update(lead, {
                    where: {
                        Id: leadId
                    },
                    returning: true
                })
                    .then(result => {
                    return result[1];
                });
            })
                .catch(ex => {
                throw ex;
            });
        });
    }
    /**
     * Tạo mới lead sau đó sẽ tạo activity default cho lead này: default là hoạt động gọi
     * @param lead lead
     */
    static create(lead) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let objExists = yield bluebird_1.Promise.all([
                user_service_1.UserService.findById(lead.UserId),
                campaign_service_1.CampaignService.findByIdAndDate(lead.CampId, moment().toDate()),
                lead_1.Lead.findOne({
                    where: {
                        $or: [{
                                Phone: lead.Phone,
                                UserId: {
                                    $ne: lead.UserId
                                }
                            }, {
                                CampId: lead.CampId,
                                Phone: lead.Phone,
                            }
                        ]
                    }
                })
            ]);
            let userDb = objExists[0];
            if (userDb == null) {
                reject({ code: code_errors_1.ManulifeErrors.EX_USERID_NOT_FOUND, msg: 'UserId not found' });
            }
            let campDb = objExists[1];
            if (campDb == null) {
                reject({ code: code_errors_1.ManulifeErrors.EX_CAMPID_NOT_FOUND, msg: 'Campaignid not found' });
            }
            let leadDb = objExists[2];
            if (leadDb == null) {
                lead.ProcessStep = 1;
                let leadNew = yield lead_1.Lead.create(lead);
                let activity = {
                    CampId: leadNew.CampId,
                    Name: 'call',
                    Phone: leadNew.Phone,
                    LeadId: leadNew.Id,
                    UserId: leadNew.UserId,
                    Type: 1,
                    Status: 0,
                    ProcessStep: leadNew.ProcessStep,
                    StartDate: moment().toDate(),
                    EndDate: moment().add(3, 'd').startOf('day').toDate(),
                    ReportTo: userDb.ReportTo,
                    ReportToList: userDb.ReportToList
                };
                let activityDb = yield activity_service_1.ActivityService.create(activity);
                resolve({ lead: leadNew, activity: activityDb });
            }
            else {
                reject({ code: code_errors_1.ManulifeErrors.EX_PHONE_EXISTS, msg: 'This phone exist' });
            }
        }))
            .catch(ex => {
            throw ex;
        });
    }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map