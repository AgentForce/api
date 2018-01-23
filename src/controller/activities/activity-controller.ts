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
import * as Faker from 'faker';
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
            let res = {
                statusCode: 200,
                data: {
                    Id: 1,
                    ProcessStep: 2,
                    Type: 2,
                    Phone: '01694248887',
                    Name: 'Gặp khách hàng',
                    StartDate: '2018-01-26',
                    EndDate: '2018-01-26',
                    FullDate: true,
                    Repeat: 1,
                    Notification: 3600,
                    Status: true,
                    Location: Faker.lorem.sentence(),
                    Description: Faker.lorem.lines()
                }
            };
            reply(res);
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
        * get activity by perild
        */
    public async calendar(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    StartDate: '2018-01-18',
                    Type: 1,
                    count: 1
                }, {
                    StartDate: '2018-01-18',
                    Type: 2,
                    count: 2
                }, {
                    StartDate: '2018-01-18',
                    Type: 3,
                    count: 2
                }, {
                    StartDate: '2018-01-18',
                    Type: 4,
                    count: 2
                }]
            };
            reply(res);
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
      * get activitis in a day
      */
    public async activitiesDay(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    Id: 1,
                    ProcessStep: 1,
                    Type: 1,
                    Phone: '01694248887',
                    Name: 'TuNguyen',
                    StartDate: '2018-01-26',
                    FullDate: true,
                }, {
                    Id: 1,
                    ProcessStep: 1,
                    Type: 1,
                    Phone: '01694248888',
                    Name: 'John',
                    StartDate: '2018-01-26',
                    FullDate: true,
                }]
            };
            reply(res);
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
     * get list activities by leadid
     */
    public async activitiesLead(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    Id: 1,
                    ProcessStep: 1,
                    Type: 1,
                    Phone: '01694248887',
                    Name: 'Tu Nguyen',
                    StartDate: '2018-01-26',
                    FullDate: true,
                }, {
                    Id: 2,
                    ProcessStep: 1,
                    Type: 1,
                    Phone: '01694248888',
                    Name: 'John',
                    StartDate: '2018-01-26',
                    FullDate: true,
                }]
            };
            reply(res);
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
