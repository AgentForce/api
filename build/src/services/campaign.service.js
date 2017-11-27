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
const user_service_1 = require("../services/user.service");
const _ = require("lodash");
const moment = require("moment");
const bluebird_1 = require("bluebird");
const lead_1 = require("../postgres/lead");
const winston_1 = require("winston");
const code_errors_1 = require("../helpers/code-errors");
var logger = new (winston_1.Logger)({
    transports: [
        new (winston_1.transports.Console)({ level: 'error' }),
        new (winston_1.transports.File)({
            filename: 'somefile.log',
            level: 'info'
        }),
    ]
});
class CampaignService {
    /**
     * find campaign by
     * @param id userid
     */
    static findByUserIdAndDate(id, date) {
        return postgres_1.Campaign
            .findOne({
            where: {
                UserId: id,
                IsDeleted: false,
                StartDate: {
                    $gte: date
                }
            }
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
         * find campaign by
         * @param id userid
         */
    static findByIdAndDate(campId, date) {
        return postgres_1.Campaign
            .findOne({
            where: {
                Id: campId,
                IsDeleted: false,
                StartDate: {
                    $gte: date
                }
            }
        })
            .catch(ex => {
            throw ex;
        });
    }
    static findByUserId(userId) {
        return postgres_1.Campaign
            .findAll({
            where: {
                UserId: userId,
                IsDeleted: false
            }
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * Find one campaign by campaignid
     * @param campaignId number
     */
    static findById(campaignId) {
        return postgres_1.Campaign
            .findOne({
            where: {
                Id: campaignId,
                IsDeleted: false
            }
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * List leads of campaign, filter by processtep
     * @param campaignId campaignid
     * @param processStep 4 step in lead
     */
    static leadsOfcampaign(campaignId, processStep) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let camp = yield this.findById(campaignId);
                if (camp == null) {
                    return [];
                }
                else {
                    return lead_1.Lead
                        .findAll({
                        where: {
                            CampId: campaignId,
                            IsDeleted: false,
                            ProcessStep: processStep
                        }
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Update current number of a campaign
     */
    static updateCurrent(campid, payload) {
        return this
            .findById(campid)
            .then((campDb) => {
            if (campDb == null) {
                throw { code: code_errors_1.ManulifeErrors.EX_CAMPID_NOT_FOUND, msg: 'campaignid not found' };
            }
            if (campDb.EndDate < moment().toDate()) {
                throw { code: code_errors_1.ManulifeErrors.EX_CAMP_FINISH, msg: 'campaign completed' };
            }
            return postgres_1.Campaign
                .update(payload, {
                where: {
                    Id: campid
                },
                returning: true
            })
                .then(result => {
                return result;
            });
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * create new user
     * @param user IUser
     */
    static createOfFA(campaign) {
        return bluebird_1.Promise
            .all([
            user_service_1.UserService.findById(campaign.UserId),
            this.findByUserIdAndDate(campaign.UserId, campaign.StartDate)
        ])
            .spread((user, camps) => __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw ({ code: code_errors_1.ManulifeErrors.EX_USERNAME_NOT_FOUND, msg: 'UserId not found' });
            }
            if (_.size(camps) > 0) {
                throw ({ code: code_errors_1.ManulifeErrors.EX_CAMP_FINISH, msg: `this user have campaign in ${campaign.StartDate}.` });
            }
            let campPrepare = yield this.prepareCamp(campaign, user)
                .catch(ex => {
                throw ex;
            });
            let campsPostgres = yield postgres_1.Campaign.bulkCreate(campPrepare, { returning: true })
                .catch(ex => {
                throw ex;
            });
            return campsPostgres;
        }))
            .catch((ex) => __awaiter(this, void 0, void 0, function* () {
            // let a = await LogCamp.find({});
            // logger.info('test winton');
            // logger.log('error', 'hello');
            throw ex;
        }));
    }
    static prepareCamp(campaign, user) {
        return new Promise((resolve, reject) => {
            campaign.ReportTo = user.ReportTo;
            campaign.ReportToList = user.ReportToList;
            let camps = [];
            let numContract = Math.ceil((campaign.IncomeMonthly * 100 / campaign.CommissionRate) / campaign.CaseSize);
            // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
            let maxCustomers = numContract * 10;
            let campTotal = _.clone(campaign);
            campTotal.Period = 13;
            campTotal.Name = 'Camp total';
            campTotal.TargetCallSale = numContract * 5 * 12;
            campTotal.TargetMetting = numContract * 3 * 12;
            campTotal.TargetContractSale = numContract * 12;
            campTotal.EndDate = moment(campaign.StartDate).add(12, 'M').endOf('d').toDate();
            camps = _.times(12, (val) => {
                let camp = _.clone(campaign);
                camp.Period = val + 1;
                camp.StartDate = moment(campaign.StartDate).add(val, 'M').toDate();
                camp.EndDate = moment(campaign.StartDate).add(val + 1, 'M').subtract(1, 'd').endOf('d').toDate();
                camp.TargetCallSale = numContract * 5;
                // dataInput.meetingCustomers = dataInput.contracts * 3;
                camp.TargetMetting = numContract * 3;
                camp.Name = `Camp ${val + 1}`;
                camp.TargetContractSale = numContract;
                return camp;
            });
            camps.push(campTotal);
            resolve(camps);
        })
            .catch(ex => {
            throw ex;
        });
    }
}
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map