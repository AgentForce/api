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
            reply(res);
        }
    }

    /**
        * get activity by perild
        */
    public async calendar(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
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
            reply(res);
        }
    }

    /**
      * get activitis in a day
      */
    public async activitiesDay(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
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
                    count: 21,
                    page: request.query.page,
                    limit: request.query.limit,
                    rows: [{
                        "Id": 1,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 0,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 1
                        }
                    }, {
                        "Id": 2,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 0,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 1
                        }
                    }, {
                        "Id": 3,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 2,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 2
                        }
                    }, {
                        "Id": 4,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 3,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 3
                        }
                    }, {
                        "Id": 5,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 1,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 1
                        }
                    }, {
                        "Id": 6,
                        "ActivityTypeId": 1,
                        "Phone": "",
                        "Name": "string",
                        "ProcessStep": 1,
                        "Location": "string",
                        "StartDate": "2017-11-11T00:00:00.000Z",
                        "EndDate": "2017-11-12T00:00:00.000Z",
                        "FullDate": true,
                        "Notification": 0,
                        "Description": "string",
                        "Type": 0,
                        "Status": false,
                        "manulife_lead": {
                            "Name": "John",
                            "ProcessStep": 1
                        }
                    }]
                },
                msg: '',
                msgCode: ''
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
                statusCode: 1,
                data: [{
                    Id: 1,
                    ProcessStep: 1,
                    Type: 1,
                    Repeat: 1,
                    Notification: 1,
                    FullDate: false,
                    StartDate: moment().add(1, 'd'),
                    EndDate: moment().add(1, 'd').endOf('day')
                }, {
                    Id: 2,
                    ProcessStep: 1,
                    Type: 1,
                    Repeat: 1000,
                    Notification: 1,
                    FullDate: false,
                    StartDate: moment().add(1, 'd'),
                    EndDate: moment().add(1, 'd').endOf('day')
                }],
                msg: '',
                msgCode: ''
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
                        msg: 'historyOfLead have errors'
                    }
                };
            }
            reply(res);
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
                },
                msg: '',
                msgCode: ''
            };
            reply(res);
            // let iAc = request.payload as IPayloadUpdate;
            // let id = parseInt(request.params.id, 10);
            // let lead: any = await ActivityService.update(id, iAc);
            // // log mongo create success
            // LogActivity.create({
            //     type: 'update activity',
            //     dataInput: {
            //         payload: request.payload,
            //         params: request.params
            //     },
            //     msg: 'success',
            //     meta: {
            //         exception: '',
            //         response: JSON.parse(JSON.stringify(lead))
            //     },
            // });
            // reply({
            //     status: HTTP_STATUS.OK,
            //     data: lead
            // }).code(HTTP_STATUS.OK);
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
            reply(res);
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
                },
                msg: '',
                msgCode: ''
            };
            reply(res);
            // let iAc = request.payload as IPayloadCreate;
            // let lead: any = await ActivityService.create(iAc);
            // // log mongo create success
            // reply({
            //     status: HTTP_STATUS.OK,
            //     data: lead
            // }).code(HTTP_STATUS.OK);
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
            reply(res);
        }
    }



}
