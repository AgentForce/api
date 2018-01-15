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
const activity_service_1 = require("../../services/activity.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const code_errors_1 = require("../../common/code-errors");
const index_2 = require("../../common/index");
class ActivitiesController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    /**
     * get activity by Id
     */
    findById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(request.params.id, 10);
                let activities = yield activity_service_1.ActivityService.findById(id);
                reply({
                    status: HTTP_STATUS.OK,
                    data: activities
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
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'activity findById have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogActivity.create({
                    type: 'activity findById have errors',
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
     * get list activities by campaignid, filter by processstep
     */
    historyOfLead(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let leadId = parseInt(request.params.leadid, 10);
                let limit = parseInt(request.query.limit, 10);
                let page = parseInt(request.query.page, 10);
                let activities = yield activity_service_1.ActivityService.listByCampaignId(leadId, limit, page);
                reply({
                    status: HTTP_STATUS.OK,
                    data: activities
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
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'historyOfLead have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogActivity.create({
                    type: 'historyOfLead have errors',
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
     * Update activity
     */
    update(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let iAc = request.payload;
                let id = parseInt(request.params.id, 10);
                let lead = yield activity_service_1.ActivityService.update(id, iAc);
                // log mongo create success
                index_1.LogActivity.create({
                    type: 'update activity',
                    dataInput: {
                        payload: request.payload,
                        params: request.params
                    },
                    msg: 'success',
                    meta: {
                        exception: '',
                        response: JSON.parse(JSON.stringify(lead))
                    },
                });
                reply({
                    status: HTTP_STATUS.OK,
                    data: lead
                }).code(HTTP_STATUS.OK);
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
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'update activity have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogActivity.create({
                    type: 'update activity',
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
     * create new actiivty
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let iAc = request.payload;
                let lead = yield activity_service_1.ActivityService.create(iAc);
                // log mongo create success
                reply({
                    status: HTTP_STATUS.OK,
                    data: lead
                }).code(HTTP_STATUS.OK);
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
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'Create activity have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogActivity.create({
                    type: 'createactivity',
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
exports.default = ActivitiesController;
//# sourceMappingURL=activity-controller.js.map