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
                        type: request.params.type,
                        currentWeek: 2,
                        campaign: [{
                                Period: 1,
                                Week: 1,
                                TargetCallSale: 30,
                                TargetMetting: 15,
                                TargetPresentation: 9,
                                TargetContractSale: 3,
                                TargetReLead: 27,
                                CurrentCallSale: 17,
                                CurrentMetting: 12,
                                CurrentPresentation: 7,
                                CurrentContract: 3,
                                CurrentReLead: 2,
                            }, {
                                Period: 1,
                                Week: 2,
                                TargetCallSale: 30,
                                TargetMetting: 15,
                                TargetPresentation: 9,
                                TargetContractSale: 3,
                                TargetReLead: 27,
                                CurrentCallSale: 17,
                                CurrentMetting: 12,
                                CurrentPresentation: 7,
                                CurrentContract: 3,
                                CurrentReLead: 2,
                            }, {
                                Period: 1,
                                Week: 3,
                                TargetCallSale: 30,
                                TargetMetting: 15,
                                TargetPresentation: 9,
                                TargetContractSale: 3,
                                TargetReLead: 27,
                                CurrentCallSale: 17,
                                CurrentMetting: 12,
                                CurrentPresentation: 7,
                                CurrentContract: 3,
                                CurrentReLead: 2,
                            }, {
                                Period: 1,
                                Week: 4,
                                TargetCallSale: 30,
                                TargetMetting: 15,
                                TargetPresentation: 9,
                                TargetContractSale: 3,
                                TargetReLead: 27,
                                CurrentCallSale: 17,
                                CurrentMetting: 12,
                                CurrentPresentation: 7,
                                CurrentContract: 3,
                                CurrentReLead: 2,
                            }]
                    };
                }
                else {
                    res = {
                        type: request.params.type,
                        campaign: [
                            {
                                TargetCallSale: 100,
                                TargetMetting: 50,
                                TargetPresentation: 30,
                                TargetContractSale: 10,
                                TargetReLead: 90,
                                CurrentCallSale: 80,
                                CurrentMetting: 40,
                                CurrentPresentation: 20,
                                CurrentContract: 10,
                                CurrentReLead: 10,
                            }
                        ]
                    };
                }
                reply({
                    statusCode: 1,
                    data: res,
                    msg: '',
                    msgCode: ''
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
                        statusCode: 0,
                        url: request.url.path,
                        error: ex
                    };
                }
                else {
                    res = {
                        statusCode: 0,
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
                reply(res);
            }
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard-controller.js.map