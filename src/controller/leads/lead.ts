import * as Mongoose from "mongoose";

interface ILead extends Mongoose.Document {
  userId: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updateAt: Date;
}

const LeadSchema = new Mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  completed: Boolean
}, {
    timestamps: true
  });
const CampaignModel = Mongoose.model<ILead>('lead', LeadSchema);
export { ILead, LeadSchema, CampaignModel };