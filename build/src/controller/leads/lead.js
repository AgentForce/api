"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const CampaignSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    completed: Boolean
}, {
    timestamps: true
});
exports.CampaignSchema = CampaignSchema;
const CampaignModel = Mongoose.model('Campaign', CampaignSchema);
exports.CampaignModel = CampaignModel;
//# sourceMappingURL=lead.js.map