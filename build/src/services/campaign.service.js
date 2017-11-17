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
class CampaignService {
    /**
     * find campaign
     * @param id userid
     */
    static findByUserId(id, date) {
        return postgres_1.Campaign
            .findOne({
            where: {
                UserId: id,
                IsDeleted: false,
                StartDate: {
                    $gte: date
                }
            }
        }).then(result => {
            return result;
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
            this.findByUserId(campaign.UserId, campaign.StartDate)
        ])
            .spread((user, camps) => __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw (['UserId not found', 1]);
            }
            if (_.size(camps) > 0) {
                throw ([2, `this user have campaign in ${campaign.StartDate}.`]);
            }
            let campPrepare = yield this.prepareCamp(campaign, user)
                .catch(ex => {
                throw ex;
            });
            let campsPostgres = yield postgres_1.Campaign.bulkCreate(campPrepare)
                .catch(ex => {
                throw ex;
            });
            return campsPostgres;
        }))
            .catch(ex => {
            throw ex;
        });
        // dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
        // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
        // dataInput.maxCustomers = dataInput.contracts * 10;
        // dataInput.callCustomers = dataInput.contracts * 5;
        // dataInput.meetingCustomers = dataInput.contracts * 3;
        // // 4. Insert DB (12 months ~ 12 new camps)
        // let listCamps = [];
        // // Xử lý date
        // const currentDate = moment().format('DD-MM-YYYY');
        // const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // await Promise.all(
        //     months.map(async (index) => {
        //         await listCamps.push({
        //             name: "Camp ",
        //             ownerid: '0057F000000eEkSQAU',
        //             policy_amount__c: dataInput.loan,
        //             commission_rate__c: dataInput.commission,
        //             actual_collected__c: dataInput.monthly,
        //             startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
        //             enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
        //             target_contacts__c: dataInput.maxCustomers,
        //             leads__c: dataInput.meetingCustomers,
        //             opportunities__c: dataInput.callCustomers,
        //             number_of_contracts_closed_in_period__c: dataInput.contracts
        //         });
        //     })
        // );
    }
    static prepareCamp(campaign, user) {
        return new Promise((resolve, reject) => {
            campaign.ReportTo = user.ReportTo;
            campaign.ReportToList = user.ReportToList;
            let camps = [];
            console.log(campaign);
            let numContract = Math.ceil((campaign.IncomeMonthly * 100 / campaign.CommissionRate) / campaign.CaseSize);
            // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
            let maxCustomers = numContract * 10;
            camps = _.times(12, (val) => {
                let camp = _.clone(campaign);
                camp.StartDate = moment(campaign.StartDate).add(val, 'M').toDate();
                camp.EndDate = moment(campaign.StartDate).add(val + 1, 'M').endOf('d').toDate();
                camp.TargetCallSale = numContract * 5;
                // dataInput.meetingCustomers = dataInput.contracts * 3;
                camp.TargetMetting = numContract * 3;
                camp.Name = `Camp ${val + 1}`;
                return camp;
            });
            resolve(camps);
        })
            .catch(ex => {
            throw ex;
        });
    }
}
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map