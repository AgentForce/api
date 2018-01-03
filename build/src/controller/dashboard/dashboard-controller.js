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
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
const index_2 = require("../../helpers/index");
const dashboard_service_1 = require("../../services/dashboard.service");
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
                let UserId = parseInt(request.params.userid, 10);
                let dashboard = yield dashboard_service_1.DashboardService.dashboard(UserId);
                if (dashboard == null) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: dashboard
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: dashboard
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
                reply(res).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
}
exports.default = DashboardController;
//# sourceMappingURL=dashboard-controller.js.map