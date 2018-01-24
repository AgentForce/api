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
const Faker = require("faker");
const _ = require("lodash");
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
                    statusCode: 200,
                    data: {
                        CampId: 1,
                        Phone: '+841603248887',
                        Name: Faker.name.firstName(),
                        Age: _.sample([1, 2, 3, 4]),
                        Gender: 1,
                        IncomMontly: _.sample([1, 2, 3, 4]),
                        MaritalStatus: 1,
                        Address: 'Quận 8',
                        City: 1,
                        District: 1,
                        Relationship: _.sample([1, 2, 3, 4]),
                        source: 1,
                        LeadType: 1,
                        ProcessStep: 1,
                        Description: 'lorem...',
                        StatusProcessStep: 1,
                        Status: false
                    }
                };
                reply(res);
                // let idEvent = parseInt(request.params.id, 10);
                // let lead: any = await LeadService.findById(idEvent);
                // if (lead == null) {
                //     return reply({
                //         status: HTTP_STATUS.NOT_FOUND,
                //         data: null,
                //     }).code(HTTP_STATUS.NOT_FOUND);
                // } else {
                //     return reply({
                //         status: HTTP_STATUS.OK,
                //         data: lead,
                //     }).code(HTTP_STATUS.OK);
                // }
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
                            msg: 'find lead have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'findById',
                    dataInput: {
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
     *  get transaction of leadid
     */
    histories(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 200,
                    data: [{
                            CampId: 1,
                            Phone: '+841603248887',
                            Name: Faker.name.firstName(),
                            Age: _.sample([1, 2, 3, 4]),
                            Gender: 1,
                            IncomMontly: _.sample([1, 2, 3, 4]),
                            MaritalStatus: 1,
                            Address: 'Quận 8',
                            City: 1,
                            District: 1,
                            Relationship: _.sample([1, 2, 3, 4]),
                            source: 1,
                            LeadType: 1,
                            ProcessStep: 1,
                            Description: 'lorem...',
                            StatusProcessStep: 1,
                            Status: false
                        }]
                };
                reply(res);
                // let idEvent = parseInt(request.params.id, 10);
                // let lead: any = await LeadService.findById(idEvent);
                // if (lead == null) {
                //     return reply({
                //         status: HTTP_STATUS.NOT_FOUND,
                //         data: null,
                //     }).code(HTTP_STATUS.NOT_FOUND);
                // } else {
                //     return reply({
                //         status: HTTP_STATUS.OK,
                //         data: lead,
                //     }).code(HTTP_STATUS.OK);
                // }
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
                            msg: 'find lead have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'findById',
                    dataInput: {
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
        * get list activities by campaignid, filter by processstep
        */
    list(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 200,
                    data: [{
                            Id: 1,
                            Phone: '+841603248887',
                            ProcessStep: 1,
                            StatusProcessStep: 1,
                            Name: Faker.name.firstName(),
                            activities: [{
                                    Id: 1,
                                    ProcessStep: 1,
                                    Type: 1,
                                    StartDate: '2018-01-26',
                                    EndDate: '2018-01-26',
                                    FullDate: true,
                                }]
                        }, {
                            Id: 2,
                            Phone: '+841603248888',
                            ProcessStep: 1,
                            StatusProcessStep: 2,
                            Name: Faker.name.firstName(),
                            activities: [{
                                    Id: 1,
                                    ProcessStep: 1,
                                    Type: 1,
                                    StartDate: '2018-01-26',
                                    EndDate: '2018-01-26',
                                    FullDate: true,
                                }]
                        }]
                };
                reply(res);
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
                            msg: 'update activity have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'get list activity',
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
        * get list leads reject by campaignid, filter by processstep
        */
    getLeadsReject(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let processStep = parseInt(request.params.processstep, 10);
                let campaignId = parseInt(request.params.campid, 10);
                let leads = yield lead_service_1.LeadService.getLeadReject(campaignId, processStep);
                reply({
                    status: HTTP_STATUS.OK,
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
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
                    statusCode: 200,
                    data: [{
                            CampId: 1,
                            Phone: '+841603248887',
                            Name: Faker.name.firstName(),
                            Age: _.sample([1, 2, 3, 4]),
                            Gender: 1,
                            IncomMontly: _.sample([1, 2, 3, 4]),
                            MaritalStatus: 1,
                            Address: 'Quận 8',
                            City: 1,
                            District: 1,
                            Relationship: _.sample([1, 2, 3, 4]),
                            source: 1,
                            LeadType: 1,
                            ProcessStep: 1,
                            Description: 'lorem...',
                            StatusProcessStep: 1,
                            Status: false
                        }]
                };
                reply(res);
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
                        error: { code: index_2.ManulifeErrors.EX_GENERAL, msg: 'Create lead have errors' }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'update lead',
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
    * update status lead
    */
    updateStatus(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 200,
                    data: [{
                            CampId: 1,
                            Phone: '+841603248887',
                            Name: Faker.name.firstName(),
                            Age: _.sample([1, 2, 3, 4]),
                            Gender: 1,
                            IncomMontly: _.sample([1, 2, 3, 4]),
                            MaritalStatus: 1,
                            Address: 'Quận 8',
                            City: 1,
                            District: 1,
                            Relationship: _.sample([1, 2, 3, 4]),
                            source: 1,
                            LeadType: 1,
                            ProcessStep: 1,
                            Description: 'lorem...',
                            StatusProcessStep: 1,
                            Status: false
                        }]
                };
                reply(res);
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
                        error: { code: index_2.ManulifeErrors.EX_GENERAL, msg: 'Create lead have errors' }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'update lead',
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
     * create lead
     * @param request  payload
     * @param reply lead
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 200,
                    data: {
                        success: 5,
                        fail: 0,
                        total: 5
                    }
                };
                reply(res);
                // let iLead = request.payload as ILead;
                // let lead: any = await LeadService.create(iLead)
                //     .catch(ex => {
                //         throw ex;
                //     });
                // // log mongo create success
                // reply({
                //     status: HTTP_STATUS.OK,
                //     data: lead
                // }).code(HTTP_STATUS.OK);
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
                        error: { code: 'ex', msg: 'Create lead have errors' }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogLead.create({
                    type: 'create lead',
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
}
exports.default = LeadController;
//# sourceMappingURL=lead-controller.js.map