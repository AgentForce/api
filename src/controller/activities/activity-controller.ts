import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { ActivityService, IActivity } from '../../services/activity.service';
import * as HTTP_STATUS from 'http-status';
import { IPayloadCreate, IPayloadUpdate } from "./activity";
import { LogActivity } from "../../mongo/index";
import { ManulifeErrors as EX } from '../../helpers/code-errors';
export default class ActivitiesController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let iAc = request.payload as IPayloadUpdate;
            let id = parseInt(request.params.id, 10);
            let lead: any = await ActivityService.update(id, iAc);
            // log mongo create success
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'Create activity have errors'
                    }
                };
            }
            LogActivity.create({
                type: 'createactivity',
                dataInput: request.payload,
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let iAc = request.payload as IPayloadCreate;
            let lead: any = await ActivityService.create(iAc);
            // log mongo create success
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'Create activity have errors'
                    }
                };
            }
            LogActivity.create({
                type: 'createactivity',
                dataInput: request.payload,
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }



}
