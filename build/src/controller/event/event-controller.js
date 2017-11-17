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
const event_service_1 = require("../../services/event.service");
const HTTP_STATUS = require("http-status");
class EventController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    findByUserId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = request.params.userid;
                let events = yield event_service_1.EventService.findbyUserId(userId);
                if (events == null) {
                    return reply(events).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply(events).code(HTTP_STATUS.OK);
                }
            }
            catch (error) {
                // log mongo create fail
                this.database.logModel
                    .create({
                    type: 'create',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
                return reply({
                    status: 400,
                    error: error
                }).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let iEvent = request.payload;
                let eventDb = yield event_service_1.EventService.create(iEvent);
                // log mongo create success
                this.database.logEvent
                    .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        data: eventDb.dataValues
                    }
                });
                reply({
                    status: HTTP_STATUS.OK,
                    data: eventDb
                }).code(HTTP_STATUS.OK);
            }
            catch (error) {
                // log mongo create fail
                this.database.logModel
                    .create({
                    type: 'create',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
                return reply({
                    status: 400,
                    error: error
                }).code(HTTP_STATUS.BAD_REQUEST);
            }
        });
    }
    updateCampaign(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = EventController;
//# sourceMappingURL=event-controller.js.map