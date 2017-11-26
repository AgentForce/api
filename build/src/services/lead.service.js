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
    static update(leadId, lead) {
        return this
            .findById(leadId)
            .then(leadDb => {
            if (leadDb == null) {
                throw { code: 'ex_lead_not_found', msg: 'Lead not found' };
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
                reject({ code: 'ex_lead_1', msg: 'UserId not found' });
            }
            let campDb = objExists[1];
            if (campDb == null) {
                reject({ code: 'ex_lead_2', msg: 'Campaignid not found' });
            }
            let leadDb = objExists[2];
            if (leadDb == null) {
                lead.ProcessStep = 1;
                let leadDb = yield lead_1.Lead.create(lead);
                let activity = {
                    CampId: leadDb.CampId,
                    Name: 'call',
                    Phone: leadDb.Phone,
                    LeadId: leadDb.Id,
                    UserId: leadDb.UserId,
                    Type: 1,
                    Status: 0,
                    ProcessStep: 1,
                    StartDate: moment().toDate(),
                    EndDate: moment().add(3, 'd').startOf('day').toDate(),
                    ReportTo: userDb.ReportTo,
                    ReportToList: userDb.ReportToList
                };
                let activityDb = yield activity_service_1.ActivityService.create(activity);
                resolve({ lead: leadDb, activity: activityDb });
            }
            else {
                reject({ code: 'ex_lead_3', msg: 'This phone exist' });
            }
        }))
            .catch(ex => {
            throw ex;
        });
    }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map