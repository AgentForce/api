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
const Boom = require("boom");
const moment = require("moment");
const _index_1 = require("../../sqpg/_index");
class CampaignController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    createCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
            const dataInput = request.payload;
            try {
                // 2. Checking permision create camp : start join and end of year (after finish 12 months)
                let currentCamps = yield _index_1.default.Language
                    .findAll()
                    .catch((error) => {
                    throw ('CreateCamp Step 2:' + JSON.stringify(error));
                });
                if (currentCamps.length === 0) {
                    // 3. Accouting Số khách hàng tiềm năng phải có (x10), hẹn gặp (x5) , Tư vấn trực tiếp (x3), chốt HD (x1)
                    dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
                    // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
                    dataInput.maxCustomers = dataInput.contracts * 10;
                    dataInput.callCustomers = dataInput.contracts * 5;
                    dataInput.meetingCustomers = dataInput.contracts * 3;
                    // 4. Insert DB (12 months ~ 12 new camps)
                    let listCamps = [];
                    // Xử lý date
                    const currentDate = moment().format('DD-MM-YYYY');
                    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                    yield Promise.all(months.map((index) => __awaiter(this, void 0, void 0, function* () {
                        yield listCamps.push({
                            name: "Camp ",
                            ownerid: '0057F000000eEkSQAU', policy_amount__c: dataInput.loan,
                            commission_rate__c: dataInput.commission,
                            actual_collected__c: dataInput.monthly,
                            startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
                            enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
                            target_contacts__c: dataInput.maxCustomers,
                            leads__c: dataInput.meetingCustomers,
                            opportunities__c: dataInput.callCustomers,
                            number_of_contracts_closed_in_period__c: dataInput.contracts
                        });
                    })));
                    return reply(listCamps).code(201);
                }
                else {
                    return reply('Campaigns exist!!!').code(200);
                }
            }
            catch (error) {
                return reply(Boom.badImplementation(error));
            }
        });
    }
    updateCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = request.auth.credentials.id;
            let id = request.params["id"];
            try {
                let campaign = yield this.database
                    .campaignModel
                    .findByIdAndUpdate({
                    _id: id,
                    userId: userId
                }, {
                    $set: request.payload
                }, {
                    new: true
                });
                if (campaign) {
                    reply(campaign);
                }
                else {
                    reply(Boom.notFound());
                }
            }
            catch (error) {
                return reply(Boom.badImplementation(error));
            }
        });
    }
    getCampaignById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = request.auth.credentials.id;
            let id = request.params["id"];
            let campaign = yield this.database
                .campaignModel
                .findOne({ _id: id, userId: userId })
                .lean(true);
            if (campaign) {
                reply(campaign);
            }
            else {
                reply(Boom.notFound());
            }
        });
    }
}
exports.default = CampaignController;
//# sourceMappingURL=campaign-controller.js.map