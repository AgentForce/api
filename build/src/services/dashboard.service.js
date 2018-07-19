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
const campaign_1 = require("../postgres/campaign");
const moment = require("moment");
const bluebird = require("bluebird");
const campaign_service_1 = require("./campaign.service");
class DashboardService {
    /**
     * Get target dashboard by week, month, year
     * @param type typeTarget
     * @param userId userid
     */
    static campDashboard(type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let camp = {};
            let period = 0;
            let target = {
                TargetCallSale: 0,
                TargetContractSale: 0,
                TargetMetting: 0,
                TargetPresentation: 0,
                CurrentCallSale: 0,
                CurrentMetting: 0,
                CurrentPresentation: 0,
                CurrentContract: 0
            };
            if (type === 'month' || type === 'week') {
                camp = yield campaign_1.Campaign
                    .findOne({
                    where: {
                        UserId: userId,
                        StartDate: {
                            $lte: moment().toDate()
                        },
                        EndDate: {
                            $gte: moment().toDate()
                        }
                    },
                    attributes: [
                        'Id',
                        'UserId',
                        'Period',
                        'CampType',
                        'StartDate',
                        'EndDate',
                        'TargetCallSale',
                        'TargetMetting',
                        'TargetPresentation',
                        'TargetContractSale',
                        'CurrentCallSale',
                        'CurrentMetting',
                        'CurrentPresentation',
                        'CurrentContract',
                        'TargetCallReCruit',
                        // 'TargetSurvey',
                        'CurrentCallRecruit',
                    ]
                });
                if (camp === null) {
                    throw {
                        code: code_errors_1.ManulifeErrors.EX_DASHBOARD_CAMP_NOT_FOUND,
                        msg: `campaign not found`
                    };
                }
                period = camp.Period;
                // TODO:
                if (type === 'week') {
                    target.TargetCallSale = camp.TargetCallSale / 4;
                    target.TargetMetting = camp.TargetMetting / 4;
                    target.TargetPresentation = camp.TargetPresentation / 4;
                    target.TargetContractSale = camp.TargetContractSale / 4;
                    // TODO: xử lý current
                    // target.CurrentMetting =
                }
                else if (type === 'month') {
                    target.TargetCallSale = camp.TargetCallSale;
                    target.TargetMetting = camp.TargetMetting;
                    target.TargetPresentation = camp.TargetPresentation;
                    target.TargetContractSale = camp.TargetContractSale;
                    // TODO: xử lý current
                    // target.CurrentMetting =
                }
                // .then(async (camp: any) => {
                //     if (camp === null) {
                //         throw {
                //             code: Ex.EX_DASHBOARD_CAMP_NOT_FOUND,
                //             msg: `campaign not found`
                //         };
                //     }
                // });
            }
            else {
                camp = yield campaign_service_1.CampaignService.getTotalCamp(userId.toString());
                period = 13;
                target.TargetCallSale = camp.TargetCallSale;
                target.TargetMetting = camp.TargetMetting;
                target.TargetPresentation = camp.TargetPresentation;
                target.TargetContractSale = camp.TargetContractSale;
            }
            return { period: period, target: target };
        });
    }
    static activitiesDashboard(type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let activities = yield postgres_1.Activity
                    .findAll({
                    where: {
                        UserId: userId,
                        IsDeleted: false,
                        StartDate: {
                            $gte: moment().startOf(type).toDate()
                        },
                        EndDate: {
                            $lte: moment().endOf(type).toDate()
                        }
                    },
                    attributes: {
                        exclude: ['IsDeleted']
                    },
                    order: [
                        ['CreatedAt', 'DESC']
                    ],
                    limit: 7
                });
                return activities;
            }
            catch (error) {
                throw {
                    error,
                    msg: 'Error function activitiesDashboard'
                };
            }
        });
    }
    /**
     * dash board in current
     */
    static dashboard(type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return bluebird
                .all([
                this.campDashboard(type, userId),
                this.activitiesDashboard(type, userId)
            ])
                .spread((camp, activities) => {
                let response = {
                    targetType: type,
                    target: camp.target,
                    period: camp.period,
                    activities: activities
                };
                return response;
            })
                .catch(ex => {
                throw ex;
            });
        });
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map