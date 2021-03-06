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
                statusCode: 1,
                data: {
                    Id: 1,
                    Phone: '841693248887',
                    Name: 'string',
                    ProcessStep: 0,
                    Location: 'string',
                    StartDate: '2017-11-11T00:00:00.000Z',
                    EndDate: '2017-11-12T00:00:00.000Z',
                    FullDate: true,
                    Notification: 0,
                    Description: 'lorem note',
                    Type: 2,
                    Status: false
                },
                msgCode: 'success',
                msg: 'success'
            };
            return reply(res);
        } catch (ex) {

        }
    }

    /**
        * get activity by perild
        */
    public async calendar(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                "statusCode": 1,
                "data": [
                    {
                        "date": moment().format('YYYY-MM-DD'),
                        "activities": [
                            {
                                "ProcessStep": 1
                            }
                        ]
                    },
                    {
                        "date": moment().add('1 d').format('YYYY-MM-DD'),
                        "activities": [
                            {
                                "ProcessStep": 2
                            },
                            {
                                "ProcessStep": 3
                            }
                        ]
                    }, {
                        "date": moment().add('2 d').format('YYYY-MM-DD'),
                        "activities": [
                            {
                                "ProcessStep": 2
                            },
                            {
                                "ProcessStep": 3
                            }
                        ]
                    }
                ],
                "msgCode": "success",
                "msg": "success"
            };
            reply(res);
        } catch (ex) {
        }
    }

    /**
      * get activitis in a day
      */
    public async activitiesDay(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                "statusCode": 1,
                "data": [
                    {
                        "Status": false,
                        "StartDate": "2018-11-11T00:00:00.000Z",
                        "ProcessStep": 2,
                        "manulife_lead": {
                            "Name": "Jhonh Hong"
                        }
                    },
                    {
                        "Status": false,
                        "StartDate": "2018-11-11T00:00:00.000Z",
                        "ProcessStep": 1,
                        "manulife_lead": {
                            "Name": 'Tu Nguyen'
                        }
                    }
                ],
                "msgCode": "success",
                "msg": "success"
            };
            reply(res);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: 0,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 0,
                    url: request.url.path,
                    error: {
                        code: EX.EX_GENERAL,
                        msg: 'activity findById have errors'
                    }
                };
            }

            reply(res);
        }
    }


    /**
     * get list activities by leadid
     */
    public async list(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {
                    page: '1',
                    limit: '2',
                    count: 2,
                    rows: [
                        {
                            Id: 2,
                            Name: 'string',
                            ProcessStep: 2,
                            Location: 'string',
                            Description: 'string',
                            CreatedAt: '2018-02-28T02:15:42.934Z',
                            manulife_lead: {
                                Name: 'string',
                                ProcessStep: 3,
                                StatusProcessStep: 2,
                                Phone: '01693248887'
                            }
                        },
                        {
                            Id: 1,
                            Name: 'string',
                            ProcessStep: 0,
                            Location: 'string',
                            Description: 'lorem note',
                            CreatedAt: '2018-02-28T02:15:42.934Z',
                            manulife_lead: {
                                Name: 'string',
                                ProcessStep: 3,
                                StatusProcessStep: 2,
                                Phone: '01693248887'
                            }
                        }
                    ]
                },
                msgCode: 'success',
                msg: 'success'
            };
            reply(res);
        } catch (ex) {
        }
    }
    /**
     * get list activities by leadid
     */
    public async activitiesLead(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                "statusCode": 1,
                "data": [
                    {
                        "Id": 2,
                        "Status": false,
                        "StartDate": "2018-02-28T02:15:42.934Z",
                        "ProcessStep": 2,
                        "manulife_lead": {
                            "Name": "string"
                        }
                    },
                    {
                        "Id": 1,
                        "Status": false,
                        "StartDate": "2018-02-28T02:15:42.934Z",
                        "ProcessStep": 1,
                        "manulife_lead": {
                            "Name": "string"
                        }
                    }
                ],
                "msgCode": "success",
                "msg": "Thành công"
            };
            reply(res);
        } catch (ex) {

        }
    }

    /**
     * Update activity
     */
    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {
                    status: true
                },
                msg: 'Thành công',
                msgCode: 'success'
            };
            reply(res);
        } catch (ex) {
        }
    }

    /**
     * create new actiivty
     */
    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {

            let res = {
                statusCode: 1,
                data: {
                    status: true
                },
                msg: 'Thành công',
                msgCode: ''
            };
            reply(res);
        } catch (ex) {

        }
    }



}
