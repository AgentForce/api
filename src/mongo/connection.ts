import * as Mongoose from "mongoose";
import { getDatabaseConfig as config } from "../configurations";

(<any>Mongoose).Promise = Promise;

Mongoose.connect(process.env.MONGO_URL || config().connectionString, { useMongoClient: true });
// let mongoDb = Mongoose.connection;
// mongoDb.on('error', () => {
//     console.log(`Unable to connect to database: ${config().connectionString}`);
// });

// mongoDb.once('open', () => {
//     console.log(`Connected to database: ${config().connectionString}`);
// });
export { Mongoose as Connection };