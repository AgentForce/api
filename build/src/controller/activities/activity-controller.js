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
const code_errors_1 = require("../../common/code-errors");
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
                let res = {
                    statusCode: 1,
                    data: {
                        Id: 1,
                        Phone: '841693248887',
                        Name: 'string',
                        ProcessStep: 0,
                        Location: 'string',
                        StartDate: '2017-11-11T00:00:00.000Z',
                        EndDate: '2017-11-12T00:00:00.000Z',
                        FullDate: true,
                        Notification: 0,
                        Description: 'lorem note',
                        Type: 2,
                        Status: false
                    },
                    msgCode: 'success',
                    msg: 'success'
                };
                return reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
        * get activity by perild
        */
    calendar(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    "statusCode": 1,
                    "data": [
                        {
                            "date": "2018-11-09",
                            "activities": [
                                {
                                    "ProcessStep": 1
                                }
                            ]
                        },
                        {
                            "date": "2018-11-11",
                            "activities": [
                                {
                                    "ProcessStep": 2
                                },
                                {
                                    "ProcessStep": 3
                                }
                            ]
                        }
                    ],
                    "msgCode": "success",
                    "msg": "success"
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
      * get activitis in a day
      */
    activitiesDay(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    "statusCode": 1,
                    "data": [
                        {
                            "Status": false,
                            "StartDate": "2018-11-11T00:00:00.000Z",
                            "ProcessStep": 2,
                            "manulife_lead": {
                                "Name": "Jhonh Hong"
                            }
                        },
                        {
                            "Status": false,
                            "StartDate": "2018-11-11T00:00:00.000Z",
                            "ProcessStep": 1,
                            "manulife_lead": {
                                "Name": 'Tu Nguyen'
                            }
                        }
                    ],
                    "msgCode": "success",
                    "msg": "success"
                };
                reply(res);
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
                            code: code_errors_1.ManulifeErrors.EX_GENERAL,
                            msg: 'activity findById have errors'
                        }
                    };
                }
                reply(res);
            }
        });
    }
    /**
     * get list activities by leadid
     */
    list(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        page: '1',
                        limit: '2',
                        count: 2,
                        rows: [
                            {
                                Id: 2,
                                Name: 'string',
                                ProcessStep: 2,
                                Location: 'string',
                                Description: 'string',
                                CreatedAt: '2018-02-28T02:15:42.934Z',
                                manulife_lead: {
                                    Name: 'string',
                                    ProcessStep: 3,
                                    StatusProcessStep: 2,
                                    Phone: '01693248887'
                                }
                            },
                            {
                                Id: 1,
                                Name: 'string',
                                ProcessStep: 0,
                                Location: 'string',
                                Description: 'lorem note',
                                CreatedAt: '2018-02-28T02:15:42.934Z',
                                manulife_lead: {
                                    Name: 'string',
                                    ProcessStep: 3,
                                    StatusProcessStep: 2,
                                    Phone: '01693248887'
                                }
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
     * get list activities by leadid
     */
    activitiesLead(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    "statusCode": 1,
                    "data": [
                        {
                            "Id": 2,
                            "Status": false,
                            "StartDate": "2018-02-28T02:15:42.934Z",
                            "ProcessStep": 2,
                            "manulife_lead": {
                                "Name": "string"
                            }
                        },
                        {
                            "Id": 1,
                            "Status": false,
                            "StartDate": "2018-02-28T02:15:42.934Z",
                            "ProcessStep": 1,
                            "manulife_lead": {
                                "Name": "string"
                            }
                        }
                    ],
                    "msgCode": "success",
                    "msg": "Thành công"
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     * Update activity
     */
    update(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        status: true
                    },
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
     * create new actiivty
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        status: true
                    },
                    msg: 'Thành công',
                    msgCode: ''
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
}
exports.default = ActivitiesController;
//# sourceMappingURL=activity-controller.js.map