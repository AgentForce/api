import { Connection } from './connection';
import { Document, model, Model, Schema } from 'mongoose';

export interface ILog extends Document {
    userId: string;
    name: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updateAt: Date;
}

const LogSchema = new Schema({
    type: {
        type: Object
    },
    dataInput: {
        type: Object
    },
    msg: {
        type: Object,
        default: ''
    },
    meta: {
        type: Object
    },
}, {
        timestamps: true
    });
const LogCamp = Connection.model<ILog>('log_camps', LogSchema);
// const LogActivity = Connection.model<ILog>('log_activities', LogSchema);
// const LogLead = Connection.model<ILog>('log_lead', LogSchema);

export { LogCamp };