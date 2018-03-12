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
const lead_service_1 = require("../../services/lead.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const index_2 = require("../../common/index");
class LeadController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    findById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        Id: 4,
                        Phone: '01693248887',
                        Name: 'string',
                        Age: 1,
                        Gender: 0,
                        IncomeMonthly: 1,
                        MaritalStatus: 1,
                        Relationship: 1,
                        Source: 0,
                        LeadType: 1,
                        ProcessStep: 3,
                        Description: 'string',
                        Status: false,
                        StatusProcessStep: 2,
                        Score: 0
                    },
                    msgCode: 'success',
                    msg: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     *  get transaction of leadid
     */
    histories(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        count: 5,
                        rows: [
                            {
                                Phone: '01693248887',
                                Name: 'string',
                                Age: 1,
                                Gender: 0,
                                IncomeMonthly: 1,
                                MaritalStatus: 1,
                                Relationship: 1,
                                Source: 0,
                                LeadType: 1,
                                ProcessStep: 0,
                                Description: 'string',
                                StatusProcessStep: 0,
                                Score: 0
                            }
                        ],
                        page: 1,
                        limit: 1
                    },
                    msgCode: 'success',
                    msg: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
        * get list activities by campaignid, filter by processstep
        */
    list(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        page: '1',
                        limit: '1',
                        count: 1,
                        rows: [
                            {
                                Phone: '01693248887',
                                Name: 'string',
                                Score: 0,
                                ProcessStep: 3,
                                StatusProcessStep: 2,
                                Id: 4
                            }
                        ]
                    },
                    msgCode: 'success',
                    msg: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
        * get list leads reject by campaignid, filter by processstep
        */
    getLeadsReject(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let processStep = parseInt(request.params.processstep, 10);
                let campaignId = parseInt(request.params.campid, 10);
                let leads = yield lead_service_1.LeadService.getLeadReject(campaignId, processStep);
                reply({
                    status: 1,
                    data: leads
                }).code(HTTP_STATUS.OK);
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
                            msg: 'get leads reject errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'get leads reject errors',
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
     * create lead
     * @param request  payload
     * @param reply lead
     */
    update(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: true,
                    msg: 'Thành công',
                    msgCode: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
    * update status lead
    */
    updateStatus(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: true,
                    msg: 'Thành công',
                    msgCode: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     * create lead
     * @param request  payload
     * @param reply lead
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: true,
                    msg: 'Thành công',
                    msgCode: 'success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
}
exports.default = LeadController;
//# sourceMappingURL=lead-controller.js.map