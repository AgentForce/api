import * as Mongoose from "mongoose";
interface IPayloadCreate {
  UserId: number;
  CampId: number;
  LeadId: number;
  ProcessStep: number;
  Location: string;
  StartDate: Date;
  EndDate: Date;
  Description: string;
  FullDate: boolean;
  Notification: number;
}

interface IPayloadUpdate {
  ProcessStep: number;
  Location: string;
  StartDate: Date;
  EndDate: Date;
  Description: string;
  FullDate: boolean;
  Notification: number;
}



export { IPayloadCreate, IPayloadUpdate };