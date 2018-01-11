import * as Mongoose from "mongoose";
import { IPayloadChangePass } from "../users/user";
interface IPayloadUpdate {
  CurrentCallSale: number;
  CurrentMetting: number;
  CurrentContract: number;
  CurrentPresentation: number;
}
class AAA implements IPayloadUpdate {
  CurrentCallSale: number;
  CurrentMetting: number;
  CurrentContract: number;
  CurrentPresentation: number;

}

export { IPayloadUpdate };