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
const metatype_service_1 = require("../../services/metatype.service");
const HTTP_STATUS = require("http-status");
const _ = require("lodash");
class MetatypeController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    findByType(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let type = request.params.type;
                let rows = yield metatype_service_1.MetatypeService.findByType(type);
                if (rows == null || _.size(rows) === 0) {
                    return reply({
                        status: HTTP_STATUS.NOT_FOUND,
                        data: rows
                    }).code(HTTP_STATUS.NOT_FOUND);
                }
                else {
                    return reply({
                        status: HTTP_STATUS.OK,
                        data: rows
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
}
exports.default = MetatypeController;
//# sourceMappingURL=metatype-controller.js.map