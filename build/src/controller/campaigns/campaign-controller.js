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
const index_1 = require("../../mongo/index");
const index_2 = require("../../common/index");
class CampaignController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    /**
     * creat a new campaign
     */
    createCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
            try {
                let res = {
                    statusCode: 1,
                    data: {},
                    msg: 'Create success',
                    msgCode: ''
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    createCampaignSM(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
            try {
                let res = {
                    statusCode: 1,
                    data: {},
                    msg: 'Create success',
                    msgCode: ''
                };
                reply(res);
                // let iCamp: ICampaign = request.payload;
                // let userId = 5;
                // const camps = <any>await CampaignService.createOfFA(iCamp, userId);
                // let logcamps = _.map(camps, (camp: any) => {
                //     return {
                //         type: 'createcampaign',
                //         dataInput: {
                //             payload: request.payload
                //         },
                //         msg: 'success',
                //         meta: {
                //             response: camp.dataValues
                //         },
                //     };
                // });
                // // save mongo log
                // LogCamp
                //     .insertMany(logcamps);
                // reply({
                //     status: HTTP_STATUS.OK,
                //     data: camps
                // }).code(200);
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'Create campaign have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogCamp.create({
                    type: 'createcampaign',
                    dataInput: {
                        payload: request.payload
                    },
                    msg: 'errors',
                    meta: {
                        exception: ex,
                        response: res
                    },
                });
                reply(res);
            }
        });
    }
    /**
     * forcast
     */
    forcast(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {},
                    msg: '',
                    msgCode: ''
                };
                reply(res);
            }
            catch (ex) {
                reply(ex);
            }
        });
    }
    /**
     * get total campaign info from cache
     * parameter:
     * @key: userid-yyyy
     */
    getTotalCamp(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let key = request.params.key;
                console.log(key);
                let obj = yield campaign_service_1.CampaignService.getTotalCamp(key);
                if (obj) {
                    reply({
                        status: 1,
                        data: obj,
                    });
                }
                else {
                    reply({
                        status: 0,
                        msg: 'not found anything',
                        msgCode: '',
                    });
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 0,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'get camptotal have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogCamp.create({
                    type: 'leadsOfCamp',
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
                reply(res);
            }
        });
    }
    /**
     *  Check campaign
     */
    checkCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        status: true
                    },
                    msg: index_2.MsgCodeResponses.CAMP_EXIST,
                    msgCode: index_2.MsgCodeResponses.CAMP_EXIST
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     * get by campaignid
     */
    getByCampaignId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = {};
                if (parseInt(request.params.period, 10) > 0) {
                    data = {
                        statusCode: 1,
                        data: {
                            campaigns: [
                                {
                                    Id: 278,
                                    Period: 2,
                                    Week: 1,
                                    TargetCallSale: 23,
                                    TargetMetting: 12,
                                    TargetPresentation: 7,
                                    TargetContractSale: 3,
                                    TargetReLead: 21,
                                    CurrentCallSale: 0,
                                    CurrentMetting: 0,
                                    CurrentPresentation: 0,
                                    CurrentContract: 0,
                                    CurrentReLead: 0
                                },
                                {
                                    Id: 279,
                                    Period: 2,
                                    Week: 2,
                                    TargetCallSale: 23,
                                    TargetMetting: 11,
                                    TargetPresentation: 7,
                                    TargetContractSale: 2,
                                    TargetReLead: 20,
                                    CurrentCallSale: 0,
                                    CurrentMetting: 0,
                                    CurrentPresentation: 0,
                                    CurrentContract: 0,
                                    CurrentReLead: 0
                                },
                                {
                                    Id: 280,
                                    Period: 2,
                                    Week: 3,
                                    TargetCallSale: 22,
                                    TargetMetting: 11,
                                    TargetPresentation: 7,
                                    TargetContractSale: 2,
                                    TargetReLead: 20,
                                    CurrentCallSale: 0,
                                    CurrentMetting: 0,
                                    CurrentPresentation: 0,
                                    CurrentContract: 0,
                                    CurrentReLead: 0
                                },
                                {
                                    Id: 281,
                                    Period: 2,
                                    Week: 4,
                                    TargetCallSale: 22,
                                    TargetMetting: 11,
                                    TargetPresentation: 6,
                                    TargetContractSale: 2,
                                    TargetReLead: 20,
                                    CurrentCallSale: 0,
                                    CurrentMetting: 0,
                                    CurrentPresentation: 0,
                                    CurrentContract: 0,
                                    CurrentReLead: 0
                                }
                            ],
                            currentWeek: 2
                        },
                        msg: 'success',
                        msgCode: 'success'
                    };
                    reply(data);
                }
                else {
                }
            }
            catch (ex) {
            }
        });
    }
}
exports.default = CampaignController;
//# sourceMappingURL=campaign-controller.js.map