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
const code_errors_1 = require("../common/code-errors");
const redis_1 = require("../cache/redis");
// var logger = new (Logger)({
//     transports: [
//         new (transports.Console)({ level: 'error' }),
//         new (transports.File)({
//             filename: 'somefile.log',
//             level: 'info'
//         }),
//     ]
// });
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
     * get total campaign of a user
     * @key: userid
     */
    static getTotalCamp(key) {
        return new Promise((resolve, reject) => {
            redis_1.default.hgetall(`campaign-total:userid${key}`, (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                console.log(res);
                if (res) {
                    resolve(res);
                }
                else {
                    // TODO: recache
                    // get 1 record campaign have NumGoal max
                    const maxNumGoal = yield postgres_1.Campaign.max('NumGoal', {
                        where: {
                            UserId: key
                        }
                    });
                    if (_.isInteger(maxNumGoal)) {
                        const campsLastUser = yield postgres_1.Campaign.findAll({
                            where: {
                                UserId: key,
                                NumGoal: maxNumGoal,
                                IsDeleted: false
                            },
                            order: [
                                ['StartDate', 'DESC']
                            ]
                        });
                        let campTotal = {
                            UserId: key,
                            TargetCallSale: 0,
                            TargetMetting: 0,
                            TargetPresentation: 0,
                            TargetContractSale: 0,
                            IncomeMonthly: 0,
                            CurrentCallSale: 0,
                            CurrentMetting: 0,
                            CurrentPresentation: 0,
                            CurentContract: 0,
                            StartDate: null,
                            EndDate: null
                        };
                        campTotal.StartDate = _.first(campsLastUser).StartDate;
                        campTotal.EndDate = _.last(campsLastUser).EndDate;
                        _.reduce(campsLastUser, (campTotal, value, key) => {
                            campTotal.TargetCallSale += value.TargetCallSale;
                            campTotal.TargetMetting += value.TargetMetting;
                            campTotal.TargetPresentation += value.TargetPresentation;
                            campTotal.TargetContractSale += value.TargetContractSale;
                            return campTotal;
                        }, campTotal);
                        this.cacheCampTotal(campTotal);
                        resolve(campTotal);
                    }
                }
                // dont exist any camp
                resolve(null);
            }));
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
                EndDate: {
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
        // return db
        //     .query(`select * from reporttolist(5, lquery_in('*'))`,
        //     { replacements: { email: 42 } })
        //     .spread((output, records: any) => {
        //         return records.rows;
        //     });
        return postgres_1.Campaign
            .findOne({
            where: {
                Id: campaignId,
                IsDeleted: false
            },
            attributes: {
                exclude: [
                    'IsDeleted',
                    'NumGoal',
                    'Credit',
                    'ReportToList',
                    'ReportTo',
                    'Results',
                    'FypRaito',
                    'M3AA',
                    'AverageCC',
                    'AgentTer',
                    'CurrentMit',
                    'CreatedAt',
                    'UpdatedAt',
                    'ActiveRaito',
                    'M3AARaito',
                    'TargetPamphlet',
                    'TargetCop',
                    'TargetAgentCode',
                    'Description',
                    'CurrentTest',
                    'CurentTer',
                    'CurrentPamphlet'
                ]
            }
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * return leads of campaign, filter by processtep
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
                throw {
                    code: code_errors_1.ManulifeErrors.EX_CAMPID_NOT_FOUND,
                    msg: 'campaignid not found'
                };
            }
            if (campDb.EndDate < moment().toDate()) {
                throw {
                    code: code_errors_1.ManulifeErrors.EX_CAMP_FINISH,
                    msg: 'campaign completed'
                };
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
    static createOfFA(campaign, userId) {
        return bluebird_1.Promise
            .all([
            user_service_1.UserService.findById(userId),
            this.findByUserIdAndDate(userId, campaign.StartDate)
        ])
            .spread((user, camps) => __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw ({
                    code: code_errors_1.ManulifeErrors.EX_USERNAME_NOT_FOUND,
                    msg: 'UserId not found'
                });
            }
            if (_.size(camps) > 0) {
                throw ({
                    code: code_errors_1.ManulifeErrors.EX_CAMP_FINISH,
                    msg: `this user have campaign in ${campaign.StartDate}.`
                });
            }
            campaign.UserId = userId;
            campaign.ReportTo = user.ReportTo;
            campaign.ReportToList = user.ReportToList;
            let campsPrepare = yield this.prepareCamp(campaign)
                .catch(ex => {
                throw ex;
            });
            let campsPostgres = yield postgres_1.Campaign.bulkCreate(campsPrepare, {
                returning: true,
            })
                .catch(ex => {
                throw ex;
            });
            // TODO: cache campaign total
            let campTotal = {
                UserId: campaign.UserId,
                TargetCallSale: 0,
                TargetMetting: 0,
                TargetPresentation: 0,
                TargetContractSale: 0,
                // IncomeMonthly: 0,
                CurrentCallSale: 0,
                CurrentMetting: 0,
                CurrentPresentation: 0,
                CurrentContract: 0,
                StartDate: campaign.StartDate,
                EndDate: moment(campaign.StartDate).add(12, 'M').endOf('d').toDate()
            };
            _.reduce(campsPostgres, (campTotal, value, key) => {
                campTotal.TargetCallSale += value.TargetCallSale;
                campTotal.TargetMetting += value.TargetMetting;
                campTotal.TargetPresentation += value.TargetPresentation;
                campTotal.TargetContractSale += value.TargetContractSale;
                campTotal.CurrentCallSale += value.CurrentCallSale;
                campTotal.CurrentMetting += value.CurrentMetting;
                campTotal.CurrentPresentation += value.CurrentPresentation;
                campTotal.CurrentContract += value.CurrentContract;
                return campTotal;
            }, campTotal);
            this.cacheCampTotal(campTotal);
            return campsPostgres;
        }))
            .catch((ex) => __awaiter(this, void 0, void 0, function* () {
            throw ex;
        }));
    }
    /**
     * prepare campaign from input client to create 12 campaign insert into database
     * @param campaign campaign
     */
    static prepareCamp(campaign) {
        return new Promise((resolve, reject) => {
            let camps = [];
            // TODO: number contract
            // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
            let numContract = Math.ceil((campaign.IncomeMonthly * 100 / campaign.CommissionRate) / campaign.CaseSize);
            camps = _.times(12, (val) => {
                let camp = _.clone(campaign);
                camp.Period = val + 1;
                camp.StartDate = moment(campaign.StartDate).add(val, 'M').toDate();
                camp.EndDate = moment(campaign.StartDate).add(val + 1, 'M').subtract(1, 'd').endOf('d').toDate();
                camp.TargetCallSale = numContract * 10;
                camp.TargetMetting = numContract * 5;
                camp.TargetPresentation = numContract * 3;
                camp.TargetContractSale = numContract;
                // TODO: default before months full target
                if (moment(camp.StartDate).unix() < moment().startOf('date').unix()) {
                    camp.CurrentCallSale = camp.TargetCallSale;
                    camp.CurrentMetting = camp.TargetMetting;
                    camp.CurrentPresentation = camp.TargetPresentation;
                    camp.CurrentContract = camp.TargetContractSale;
                }
                return camp;
            });
            resolve(camps);
        })
            .catch(ex => {
            throw ex;
        });
    }
    /**
     * cache total campaign
     * @param totalCampaign total campaign
     */
    static cacheCampTotal(totalCampaign) {
        return redis_1.default.hmset(`campaign-total:userid${totalCampaign.UserId}`, 'TargetCallSale', totalCampaign.TargetCallSale, 'TargetMetting', totalCampaign.TargetMetting, 'TargetPresentation', totalCampaign.TargetPresentation, 'TargetContractSale', totalCampaign.TargetContractSale, 
        // 'IncomeMonthly',
        // totalCampaign.IncomeMonthly,
        'CurrentCallSale', totalCampaign.CurrentCallSale, 'CurrentMetting', totalCampaign.CurrentMetting, 'CurrentPresentation', totalCampaign.CurrentPresentation, 'CurrentContract', totalCampaign.CurrentContract, 'StartDate', moment(totalCampaign.StartDate).format('YYYY-MM-DD'), 'EndDate', moment(totalCampaign.EndDate).format('YYYY-MM-DD'), (err, res) => {
            if (err) {
                throw err;
            }
            console.log(res);
        });
    }
}
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map