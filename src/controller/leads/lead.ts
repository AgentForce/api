import * as Mongoose from "mongoose";

interface ILead extends Mongoose.Document {
  userId: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updateAt: Date;
}
interface IPayloadUpdate {
  Phone: string;
  Name: string;
  Age: number;
  Gender: number;
  IncomeMonthly: number;
  MaritalStatus: number;
  Address: string;
  City: number;
  District: number;
  Relationship: number;
  Source: number;
  Job: string;
  LeadType: number;
  ProcessStep: number;
  Description: string;
}
export { ILead, IPayloadUpdate };