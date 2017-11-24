"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const LeadSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    completed: Boolean
}, {
    timestamps: true
});
exports.LeadSchema = LeadSchema;
const CampaignModel = Mongoose.model('lead', LeadSchema);
exports.CampaignModel = CampaignModel;
//# sourceMappingURL=lead.js.map