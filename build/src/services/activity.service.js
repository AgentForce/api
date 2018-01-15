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
const campaign_service_1 = require("./campaign.service");
const user_service_1 = require("./user.service");
const lead_1 = require("../postgres/lead");
const code_errors_1 = require("../common/code-errors");
const campaign_1 = require("../postgres/campaign");
const moment = require("moment");
const _ = require("lodash");
const common_1 = require("../common");
class ActivityService {
    /**
    * get a activity by activityId
    * @param phone string
    */
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let activity = yield postgres_1.Activity.findOne({
                    where: {
                        Id: id,
                        IsDeleted: false
                    },
                    attributes: {
                        exclude: ['IsDeleted', 'ReportTo', 'ReportToList']
                    }
                });
                return activity;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
    * list activities of a leadid
    * @param campId
    * @param processStep
    * @param limit: number row of page
    */
    static listByCampaignId(leadId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let offset = limit * (page - 1);
                let activities = yield postgres_1.Activity.findAll({
                    where: {
                        LeadId: leadId,
                        IsDeleted: false,
                    },
                    order: [
                        ['StartDate', 'DESC']
                    ],
                    attributes: {
                        exclude: ['IsDeleted', 'ReportTo', 'ReportToList']
                    },
                    // number row skip
                    offset: offset,
                    limit: limit
                });
                return {
                    data: activities,
                    page: page,
                    limit: limit
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * create new  activiy
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
                Name: payload.Type.toString(),
                Type: payload.Type,
                ProcessStep: lead.ProcessStep,
                ReportToList: user.ReportToList,
                FullDate: payload.FullDate,
                Location: payload.Location,
                Notification: payload.Notification,
                ReportTo: user.ReportTo,
                Status: 1,
                StartDate: payload.StartDate,
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
        return Promise
            .all([
            postgres_1.Activity
                .findOne({
                where: {
                    Id: activityId,
                    IsDeleted: false,
                    CampId: payload.CampId
                }
            }),
            campaign_service_1.CampaignService.findByIdAndDate(payload.CampId, moment().toDate())
        ])
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            let activity = result[0];
            if (activity == null) {
                throw {
                    code: code_errors_1.ManulifeErrors.EX_ACTIVITYID_NOT_FOUND,
                    msg: `ActivityId ${activityId} not found vs campid ${payload.CampId}`
                };
            }
            let camp = result[1];
            if (camp == null) {
                throw {
                    code: code_errors_1.ManulifeErrors.EX_CAMPID_NOT_FOUND,
                    msg: `campaign ${payload.CampId} finished or dont exist`
                };
            }
            let updateCamp = {
                CurrentCallSale: camp.CurrentCallSale,
                CurentContract: camp.CurrentContract,
                CurrentMetting: camp.CurrentMetting,
                CurrentPresentation: camp.CurrentPresentation
            };
            if (payload.Status === 1 && activity.Status === common_1.Constants.ACTIVITY_DEACTIVE) {
                if (activity.Type === 1) {
                    updateCamp.CurrentCallSale += 1;
                }
                else if (activity.Type === 2) {
                    updateCamp.CurrentMetting += 1;
                }
                else if (activity.Type === 3) {
                    updateCamp.CurrentMetting += 1;
                }
                else if (activity.Type === 4) {
                    updateCamp.CurrentPresentation += 1;
                }
            }
            else if (payload.Status === 0 && activity.Status === common_1.Constants.ACTIVITY_ACTIVE) {
                if (activity.Type === 1) {
                    updateCamp.CurrentCallSale -= 1;
                }
                else if (activity.Type === 2) {
                    updateCamp.CurrentMetting -= 1;
                }
                else if (activity.Type === 3) {
                    updateCamp.CurrentMetting -= 1;
                }
                else if (activity.Type === 4) {
                    updateCamp.CurrentPresentation -= 1;
                }
            }
            // Update activity and update current some target
            return Promise
                .all([
                postgres_1.Activity
                    .update(payload, {
                    where: {
                        Id: activityId
                    },
                    returning: true
                }).then(acDb => {
                    return acDb[1];
                }),
                campaign_1.Campaign
                    .update(updateCamp, {
                    returning: true,
                    where: {
                        Id: activity.CampId
                    },
                })
                    .then(campDb => {
                    return campDb[1];
                })
            ])
                .then(rs => {
                let obj = _.flatten(rs);
                return { activity: obj[0], camp: obj[1] };
            })
                .catch(ex => {
                throw ex;
            });
        }))
            .catch(ex => {
            throw ex;
        });
    }
}
exports.ActivityService = ActivityService;
//# sourceMappingURL=activity.service.js.map