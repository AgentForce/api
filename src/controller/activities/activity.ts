import * as Mongoose from "mongoose";
interface IPayloadCreate {
  UserId: number;
  CampId: number;
  LeadId: number;
  Type: number;
  Location: string;
  StartDate: Date;
  EndDate: Date;
  Description: string;
  FullDate: boolean;
  Notification: number;
}

interface IPayloadUpdate {
  CampId: number;
  Location: string;
  StartDate: Date;
  EndDate: Date;
  Description: string;
  FullDate: boolean;
  Notification: number;
  Status: number;
}



export { IPayloadCreate, IPayloadUpdate };