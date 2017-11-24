"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
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
const LogCamp = connection_1.Connection.model('log_camps', LogSchema);
exports.LogCamp = LogCamp;
const LogActivity = connection_1.Connection.model('log_activities', LogSchema);
exports.LogActivity = LogActivity;
const LogLead = connection_1.Connection.model('log_leads', LogSchema);
exports.LogLead = LogLead;
const LogUser = connection_1.Connection.model('log_users', LogSchema);
exports.LogUser = LogUser;
//# sourceMappingURL=index.js.map