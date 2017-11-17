"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const user_1 = require("./controller/users/user");
const campaign_1 = require("./controller/campaigns/campaign");
const log_1 = require("./mongo/log");
function init(config) {
    Mongoose.Promise = Promise;
    Mongoose.connect(process.env.MONGO_URL || config.connectionString);
    let mongoDb = Mongoose.connection;
    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.connectionString}`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.connectionString}`);
    });
    return {
        userModel: user_1.UserModel,
        campaignModel: campaign_1.CampaignModel,
        logModel: log_1.LogModel('log'),
        logLead: log_1.LogModel('log_lead')
    };
}
exports.init = init;
//# sourceMappingURL=database.js.map