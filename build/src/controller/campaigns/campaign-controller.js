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
const campaign_service_1 = require("../../services/campaign.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
class CampaignController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    createCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
            try {
                let iCamp = request.payload;
                const camps = yield campaign_service_1.CampaignService.createOfFA(iCamp);
                reply({
                    status: HTTP_STATUS.OK,
                    data: camps
                }).code(200);
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        error: {
                            code: 'ex_payload',
                            msg: 'Create campaign have errors'
                        }
                    };
                }
                index_1.LogCamp.create({
                    type: 'createcampaign',
                    dataInput: request.payload,
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    leadsOfCamp(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let campId = parseInt(request.params.id, 10);
                let type = parseInt(request.params.type, 10);
                const leads = yield campaign_service_1.CampaignService.leadsOfcampaign(campId, type);
                reply({
                    status: 200,
                    leads: leads
                }).code(200);
            }
            catch (error) {
                return reply({
                    status: 400,
                    error: error
                }).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    bk() {
        // 2. Checking permision create camp : start join and end of year (after finish 12 months)
        // let currentCamps = await db.Language
        //     .findAll()
        //     .catch((error) => {
        //         throw ('CreateCamp Step 2:' + JSON.stringify(error));
        //     });
        // if (currentCamps.length === 0) {
        //     // 3. Accouting Số khách hàng tiềm năng phải có (x10), hẹn gặp (x5) , Tư vấn trực tiếp (x3), chốt HD (x1)
        //     dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
        //     // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
        //     dataInput.maxCustomers = dataInput.contracts * 10;
        //     dataInput.callCustomers = dataInput.contracts * 5;
        //     dataInput.meetingCustomers = dataInput.contracts * 3;
        //     // 4. Insert DB (12 months ~ 12 new camps)
        //     let listCamps = [];
        //     // Xử lý date
        //     const currentDate = moment().format('DD-MM-YYYY');
        //     const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        //     await Promise.all(
        //         months.map(async (index) => {
        //             await listCamps.push({
        //                 name: "Camp ",
        //                 ownerid: '0057F000000eEkSQAU', policy_amount__c: dataInput.loan,
        //                 commission_rate__c: dataInput.commission,
        //                 actual_collected__c: dataInput.monthly,
        //                 startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
        //                 enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
        //                 target_contacts__c: dataInput.maxCustomers,
        //                 leads__c: dataInput.meetingCustomers,
        //                 opportunities__c: dataInput.callCustomers,
        //                 number_of_contracts_closed_in_period__c: dataInput.contracts
        //             });
        //         })
        //     );
        //     return reply(listCamps).code(201);
        // } else {
        //     return reply('Campaigns exist!!!').code(200);
        // }
    }
    /**
     * update target of campaign
     * @param request reques
     * @param reply res
     */
    updateCurrent(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(request.params.id, 10);
                let payload = request.payload;
                let campaign = yield campaign_service_1.CampaignService.updateCurrent(id, payload);
                // log mongo create success
                index_1.LogCamp
                    .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        data: campaign.dataValues
                    }
                });
                reply({
                    status: HTTP_STATUS.OK,
                    data: campaign
                }).code(HTTP_STATUS.OK);
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: HTTP_STATUS.BAD_GATEWAY,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: HTTP_STATUS.BAD_GATEWAY,
                        error: { code: 'ex', msg: 'update campaign have errors' }
                    };
                }
                index_1.LogCamp.create({
                    type: 'updatecamp',
                    dataInput: {
                        payload: request.payload,
                        params: request.params
                    },
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    getByCampaignId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let campid = request.params.id;
                let campaign = yield campaign_service_1.CampaignService.findById(campid);
                if (campaign == null) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: campaign
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: campaign
                    }).code(HTTP_STATUS.OK);
                }
            }
            catch (error) {
                // log mongo create fail
                index_1.LogCamp
                    .create({
                    type: 'getByCampaignId',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
                return reply({
                    status: 400,
                    error: error
                }).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    getByUserId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let UserId = request.params.userid;
                let campaigns = yield campaign_service_1.CampaignService.findByUserId(UserId);
                if (campaigns == null) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: campaigns
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: campaigns
                    }).code(HTTP_STATUS.OK);
                }
            }
            catch (error) {
                // log mongo create fail
                index_1.LogCamp
                    .create({
                    type: 'getByCampaignId',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
                return reply({
                    status: 400,
                    error: error
                }).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
}
exports.default = CampaignController;
//# sourceMappingURL=campaign-controller.js.map