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
const postgres_1 = require("../postgres");
class MetatypeService {
    /**
     * list all event of userid
     * @param userId number
     */
    static findByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let types = yield postgres_1.MetaType.findAll({
                    where: {
                        Type: type,
                        IsDeleted: false
                    }
                });
                return types;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MetatypeService = MetatypeService;
//# sourceMappingURL=metatype.service.js.map