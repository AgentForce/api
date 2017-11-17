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
const lead_1 = require("../postgres/lead");
class LeadService {
    /**
     * Tìm một lead dựa vào số điện thoại
     * @param phone string
     */
    static findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lead = yield lead_1.Lead.findOne({
                    where: {
                        Phone: phone,
                        IsDeleted: false
                    }
                });
                return lead;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /**
     * Tạo mới lead
     * @param lead lead
     */
    static create(lead) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let existLead = yield this.findByPhone(lead.Phone);
            if (existLead == null) {
                lead_1.Lead.create(lead)
                    .then(rs => {
                    resolve(rs);
                })
                    .catch(ex => {
                    reject(ex);
                });
            }
            else {
                reject([3, 'Phone exist']);
            }
        }))
            .catch(ex => {
            throw ex;
        });
    }
}
exports.LeadService = LeadService;
//# sourceMappingURL=lead.service.js.map