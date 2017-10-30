"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const user_1 = require("./controller/users/user");
const campaign_1 = require("./controller/campaigns/campaign");
function init(config) {
    Mongoose.Promise = Promise;
    console.log('hello');
    //console.log(process.env.MONGO_URL);
    Mongoose.connect('mongodb://manulife:manulife!!!@103.48.191.254:27017/manulife');
    let mongoDb = Mongoose.connection;
    mongoDb.on('error', () => {
        console.log(`Unable to connect to database mongo`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database mongo`);
    });
    return {
        userModel: user_1.UserModel,
        campaignModel: campaign_1.CampaignModel
    };
}
exports.init = init;
//# sourceMappingURL=database.js.map