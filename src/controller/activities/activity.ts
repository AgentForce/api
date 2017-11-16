import * as Mongoose from "mongoose";

interface ICampaign extends Mongoose.Document {
  userId: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updateAt: Date;
}

const CampaignSchema = new Mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  completed: Boolean
}, {
    timestamps: true
  });
const CampaignModel = Mongoose.model<ICampaign>('Campaign', CampaignSchema);
export { ICampaign, CampaignSchema, CampaignModel };