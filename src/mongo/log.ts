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
const LogModel = (nameCollection) => {
    return model<ILog>(nameCollection, LogSchema);
};

export { LogModel };