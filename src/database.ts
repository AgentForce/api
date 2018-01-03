import * as Mongoose from "mongoose";
import { IDataConfiguration } from "./configurations";
import { IUser, UserModel } from "./controller/users/user";
import { ILog, LogModel } from './mongo/log';
export interface IDatabase {
    userModel: Mongoose.Model<IUser>;
}

export function init(config: IDataConfiguration): IDatabase {

    (<any>Mongoose).Promise = Promise;
    Mongoose.connect(process.env.MONGO_URL || config.connectionString, { useMongoClient: true });

    let mongoDb = Mongoose.connection;

    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.connectionString}`);
    });
    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.connectionString}`);
    });

    return {
        userModel: UserModel,
    };
}