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
class CampaignController {
    constructor(configs, database) {
        this.configs = configs;
        this.database = database;
    }
    /**
     * get
     */
    get(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        "Id": 2,
                        "UserId": 5,
                        "CampId": 134,
                        "Phone": "01693248887",
                        "Name": "string",
                        "Period": 2
                    },
                    msg: '',
                    msgCode: 'get_success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     * get
     */
    list(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        items: [{
                                Phone: '841693258887',
                                FullName: 'Tu Nguyen'
                            }, {
                                Phone: '841693258888',
                                FullName: 'Hong Dao'
                            }, {
                                Phone: '841693258889',
                                FullName: 'Alex'
                            }],
                        totalItem: 20,
                        page: 1,
                        limit: 10
                    },
                    msg: '',
                    msgCode: 'get_success'
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
    /**
     * post
     */
    create(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = {
                    statusCode: 1,
                    data: {
                        "Id": 2,
                        "UserId": 5,
                        "CampId": 134,
                        "Phone": "01693248887",
                        "Name": "string",
                        "Period": 2
                    },
                    msg: 'Create success',
                    msgCode: ''
                };
                reply(res);
            }
            catch (ex) {
            }
        });
    }
}
exports.default = CampaignController;
//# sourceMappingURL=relead-controller.js.map