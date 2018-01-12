import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { ActivityService, IActivity } from '../../services/activity.service';
import * as HTTP_STATUS from 'http-status';
import { IPayloadCreate, IPayloadUpdate } from "./activity";
import { LogActivity } from "../../mongo/index";
import { ManulifeErrors as EX } from '../../common/code-errors';
import { SlackAlert } from "../../common/index";
export default class ActivitiesController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }


    /**
     * get activity by Id
     */
    public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let id = parseInt(request.params.id, 10);
            let activities: any = await ActivityService.findById(id);
            reply({
                status: HTTP_STATUS.OK,
                data: activities
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: HTTP_STATUS.BAD_REQUEST,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: HTTP_STATUS.BAD_REQUEST,
                    url: request.url.path,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'activity findById have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogActivity.create({
                type: 'activity findById have errors',
                dataInput: {
                    payload: request.payload,
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * get list activities by campaignid, filter by processstep
     */
    public async historyOfLead(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let leadId = parseInt(request.params.leadid, 10);
            let limit = parseInt(request.query.limit, 10);
            let page = parseInt(request.query.page, 10);
            let activities: any = await ActivityService.listByCampaignId(leadId, limit, page);
            reply({
                status: HTTP_STATUS.OK,
                data: activities
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: HTTP_STATUS.BAD_REQUEST,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: HTTP_STATUS.BAD_REQUEST,
                    url: request.url.path,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'historyOfLead have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogActivity.create({
                type: 'historyOfLead have errors',
                dataInput: {
                    payload: request.payload,
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * Update activity
     */
    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let iAc = request.payload as IPayloadUpdate;
            let id = parseInt(request.params.id, 10);
            let lead: any = await ActivityService.update(id, iAc);
            // log mongo create success
            LogActivity.create({
                type: 'update activity',
                dataInput: {
                    payload: request.payload,
                    params: request.params
                },
                msg: 'success',
                meta: {
                    exception: '',
                    response: JSON.parse(JSON.stringify(lead))
                },
            });
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'update activity have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogActivity.create({
                type: 'update activity',
                dataInput: {
                    payload: request.payload,
                    params: request.params
                },
                msg: 'errors',
                meta: {
                    exception: ex,
                    response: res
                },
            });
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }

    /**
     * create new actiivty
     */
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
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 400,
                    url: request.url.path,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'Create activity have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
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
