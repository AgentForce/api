"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LogSchema = new mongoose_1.Schema({
    type: {
        type: Object
    },
    dataInput: {
        type: Object
    },
    msg: {
        type: Object,
        default: ''
    },
    meta: {
        type: Object
    },
}, {
    timestamps: true
});
const LogModel = (nameCollection) => {
    return mongoose_1.model(nameCollection, LogSchema);
};
exports.LogModel = LogModel;
//# sourceMappingURL=log.js.map