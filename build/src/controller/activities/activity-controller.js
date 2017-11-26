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
const Boom = require("boom");
const activity_service_1 = require("../../services/activity.service");
const HTTP_STATUS = require("http-status");
const index_1 = require("../../mongo/index");
class ActivitiesController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
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
                        error: ex
                    };
                }
                else {
                    res = {
                        status: 400,
                        error: { code: 'ex', msg: 'Create activity have errors' }
                    };
                }
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
    updateCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // let userId = request.auth.credentials.id;
            // let id = request.params["id"];
            // try {
            //     let campaign: ICampaign = await this.database
            //         .campaignModel
            //         .findByIdAndUpdate({
            //             _id: id,
            //             userId: userId
            //         }, {
            //             $set: request.payload
            //         }, {
            //             new: true
            //         });
            //     if (campaign) {
            //         reply(campaign);
            //     } else {
            //         reply(Boom.notFound());
            //     }
            // } catch (error) {
            //     return reply(Boom.badImplementation(error));
            // }
        });
    }
    getCampaignById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = request.auth.credentials.id;
            let id = request.params["id"];
            let campaign = yield this.database
                .campaignModel
                .findOne({ _id: id, userId: userId })
                .lean(true);
            if (campaign) {
                reply(campaign);
            }
            else {
                reply(Boom.notFound());
            }
        });
    }
}
exports.default = ActivitiesController;
//# sourceMappingURL=activity-controller.js.map