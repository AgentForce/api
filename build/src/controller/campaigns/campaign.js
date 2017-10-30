"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
exports.CampaignSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    completed: Boolean
}, {
    timestamps: true
});
exports.CampaignModel = Mongoose.model('Campaign', exports.CampaignSchema);
//# sourceMappingURL=campaign.js.map