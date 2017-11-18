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
const invite_service_1 = require("../../services/invite.service");
const HTTP_STATUS = require("http-status");
const _ = require("lodash");
class InviteController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    findByUserId(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = request.params.userid;
                let invites = yield invite_service_1.InviteService.findbyUserId(userId);
                if (invites == null || _.size(invites) === 0) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: invites,
                        msg: 'not found'
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: invites
                    }).code(HTTP_STATUS.OK);
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
    findById(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = request.params.id;
                console.log(id);
                let invite = yield invite_service_1.InviteService.findById(id);
                if (invite == null) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: invite,
                        msg: 'not found'
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: invite
                    }).code(HTTP_STATUS.OK);
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
    /**
     * Tạo mới invite
     * @param request request
     * @param reply request
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let invite = request.payload;
                let inviteDb = yield invite_service_1.InviteService.create(invite);
                // log mongo create success
                this.database.logEvent
                    .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        data: inviteDb.dataValues
                    }
                });
                reply({
                    status: HTTP_STATUS.OK,
                    data: inviteDb
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
exports.default = InviteController;
//# sourceMappingURL=invite-controller.js.map