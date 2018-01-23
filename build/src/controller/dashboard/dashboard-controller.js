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
const moment = require("moment");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const index_2 = require("../../common/index");
class DashboardController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    /**
     * dashboard
     */
    dashboard(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {};
                if (request.params.type === 'weekmonth') {
                    res = {
                        typeTarget: request.params.type,
                        currentweek: 2,
                        campaign: [{
                                Period: 1,
                                Week: 1,
                                TargetCallSale: 25,
                                TargetContractSale: 10,
                                TargetMetting: 5,
                                TargetPresentation: 2,
                                CurrentCallSale: 1,
                                CurrentMetting: 1,
                                CurrentPresentation: 8,
                                CurrentContract: 0
                            }, {
                                Period: 1,
                                Week: 2,
                                TargetCallSale: 25,
                                TargetContractSale: 10,
                                TargetMetting: 5,
                                TargetPresentation: 2,
                                CurrentCallSale: 1,
                                CurrentMetting: 1,
                                CurrentPresentation: 8,
                                CurrentContract: 0
                            }, {
                                Period: 1,
                                Week: 3,
                                TargetCallSale: 25,
                                TargetContractSale: 10,
                                TargetMetting: 5,
                                TargetPresentation: 2,
                                CurrentCallSale: 1,
                                CurrentMetting: 1,
                                CurrentPresentation: 8,
                                CurrentContract: 0
                            }, {
                                Period: 1,
                                Week: 4,
                                TargetCallSale: 25,
                                TargetContractSale: 10,
                                TargetMetting: 5,
                                TargetPresentation: 2,
                                CurrentCallSale: 1,
                                CurrentMetting: 1,
                                CurrentPresentation: 8,
                                CurrentContract: 0
                            }],
                        activities: [{
                                Id: 1,
                                ProcessStep: 1,
                                Type: 1,
                                Repeat: 1,
                                Notification: 1,
                                FullDate: false,
                                StartDate: moment().add(1, 'd'),
                                EndDate: moment().add(1, 'd').endOf('day')
                            }, {
                                Id: 2,
                                ProcessStep: 1,
                                Type: 1,
                                Repeat: 1000,
                                Notification: 1,
                                FullDate: false,
                                StartDate: moment().add(1, 'd'),
                                EndDate: moment().add(1, 'd').endOf('day')
                            }]
                    };
                }
                else {
                    res = {
                        typeTarget: request.params.type,
                        target: {
                            TargetCallSale: 100,
                            TargetContractSale: 50,
                            TargetMetting: 30,
                            TargetPresentation: 10,
                            CurrentCallSale: 10,
                            CurrentMetting: 45,
                            CurrentPresentation: 8,
                            CurrentContract: 1
                        },
                        campaign: [{
                                TargetCallSale: 25,
                                TargetContractSale: 10,
                                TargetMetting: 5,
                                TargetPresentation: 2,
                                CurrentCallSale: 1,
                                CurrentMetting: 1,
                                CurrentPresentation: 8,
                                CurrentContract: 0
                            }],
                        activities: [{
                                Id: 1,
                                ProcessStep: 1,
                                Type: 1,
                                Repeat: 1,
                                Notification: 1,
                                FullDate: false,
                                StartDate: moment().add(1, 'd'),
                                EndDate: moment().add(1, 'd').endOf('day')
                            }, {
                                Id: 2,
                                ProcessStep: 1,
                                Type: 1,
                                Repeat: 1000,
                                Notification: 1,
                                FullDate: false,
                                StartDate: moment().add(1, 'd'),
                                EndDate: moment().add(1, 'd').endOf('day')
                            }]
                    };
                }
                reply({
                    statusCode: 200,
                    data: res,
                });
                // let type = request.params.type as typeTarget;
                // let UserId = 5;
                // let dashboard: any = await DashboardService.dashboard(type, UserId);
                // if (dashboard == null) {
                //     return reply({
                //         statusCode: HTTP_STATUS.NOT_FOUND,
                //         data: dashboard
                //     })
                //         .code(HTTP_STATUS.NOT_FOUND);
                // } else {
                //     return reply({
                //         statusCode: HTTP_STATUS.OK,
                //         data: dashboard
                //     }).code(HTTP_STATUS.OK);
                // }
            }
            catch (ex) {
                // log mongo create fail
                let res = {};
                if (ex.code) {
                    res = {
                        statusCode: HTTP_STATUS.BAD_GATEWAY,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        statusCode: HTTP_STATUS.BAD_GATEWAY,
                        url: request.url.path,
                        error: {
                            code: index_2.ManulifeErrors.EX_GENERAL,
                            msg: 'get dashboard have errors'
                        }
                    };
                }
                index_2.SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
                index_1.LogCamp.create({
                    type: 'dashboard',
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
                reply(res)
                    .code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard-controller.js.map