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
class LeadController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    findById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let idEvent = request.params.id;
                let events = yield lead_service_1.LeadService.findById(idEvent);
                if (events == null) {
                    return reply(events).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply(events).code(HTTP_STATUS.OK);
                }
            }
            catch (error) {
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
                let iLead = request.payload;
                let lead = yield lead_service_1.LeadService.create(iLead)
                    .catch(ex => {
                    throw ex;
                });
                // log mongo create success
                this.database.logLead
                    .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        lead: lead.dataValues
                    }
                });
                reply({
                    status: HTTP_STATUS.OK,
                    data: lead
                }).code(HTTP_STATUS.OK);
            }
            catch (error) {
                // log mongo create fail
                this.database.logLead
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
}
exports.default = LeadController;
//# sourceMappingURL=lead-controller.js.map