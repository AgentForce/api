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
const _ = require("lodash");
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
                let iCamp = request.payload;
                let userId = 5;
                const camps = yield campaign_service_1.CampaignService.createOfFA(iCamp, userId);
                let logcamps = _.map(camps, (camp) => {
                    return {
                        type: 'createcampaign',
                        dataInput: {
                            payload: request.payload
                        },
                        msg: 'success',
                        meta: {
                            response: camp.dataValues
                        },
                    };
                });
                // save mongo log
                index_1.LogCamp
                    .insertMany(logcamps);
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
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
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
                        status: HTTP_STATUS.OK,
                        data: obj,
                    }).code(HTTP_STATUS.OK);
                }
                else {
                    reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        msg: 'not found anything'
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
            }
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: HTTP_STATUS.BAD_REQUEST,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: HTTP_STATUS.BAD_REQUEST,
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     *  list leads of a campaign
     */
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
            catch (ex) {
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'get leadsOfCamp have errors'
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    /**
     * get by campaignid
     */
    getByCampaignId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let campid = request.params.id;
                let campaign = yield campaign_service_1.CampaignService.findById(campid);
                if (campaign == null) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: campaign,
                        code: index_2.ManulifeErrors.EX_CAMPID_NOT_FOUND
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: campaign
                    }).code(HTTP_STATUS.OK);
                }
            }
            catch (ex) {
                // log mongo create fail
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'get getByCampaignId have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogCamp.create({
                    type: 'getByCampaignId',
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
    /**
     * get list campaign of userid
     */
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
            catch (ex) {
                // log mongo create fail
                let res = {};
                if (ex.code) {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'get getByUserId have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogCamp.create({
                    type: 'getByUserId',
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
}
exports.default = CampaignController;
//# sourceMappingURL=campaign-controller.js.map