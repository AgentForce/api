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
const code_errors_1 = require("../helpers/code-errors");
const campaign_1 = require("../postgres/campaign");
const _ = require("lodash");
const helpers_1 = require("../helpers");
class DashboardService {
    /**
     * dash board in current
     */
    static dashboard(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return campaign_1.Campaign
                .findOne({
                where: {
                    UserId: userId
                },
                attributes: {
                    exclude: ['IsDeleted']
                }
            })
                .then((camp) => __awaiter(this, void 0, void 0, function* () {
                if (camp === null) {
                    throw {
                        code: code_errors_1.ManulifeErrors.EX_DASHBOARD_CAMP_NOT_FOUND,
                        msg: `campaign not found`
                    };
                }
                let activities = yield postgres_1.Activity
                    .findAll({
                    where: {
                        UserId: userId,
                        CampId: camp.Id,
                        IsDeleted: false,
                    },
                    attributes: {
                        exclude: ['IsDeleted']
                    }
                });
                let groupActivities = {
                    call: [],
                    metting: [],
                    presentation: [],
                    close: [],
                };
                if (activities !== null) {
                    _.reduce(activities, (group, value, key) => {
                        if (value.Type === helpers_1.Constants.ACTIVITY_TYPE_CALL) {
                            groupActivities.call.push(value);
                        }
                        if (value.Type === helpers_1.Constants.ACTIVITY_TYPE_METTING) {
                            groupActivities.metting.push(value);
                        }
                        if (value.Type === helpers_1.Constants.ACTIVITY_TYPE_PRESENTATION) {
                            groupActivities.presentation.push(value);
                        }
                        if (value.Type === helpers_1.Constants.ACTIVITY_TYPE_CLOSE) {
                            groupActivities.close.push(value);
                        }
                        return group;
                    }, groupActivities);
                }
                return { campaign: camp, activities: groupActivities };
            }))
                .catch(ex => {
                throw ex;
            });
        });
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map