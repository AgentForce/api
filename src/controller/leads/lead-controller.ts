import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { LeadService, ILead } from '../../services/lead.service';
import * as HTTP_STATUS from 'http-status';
import { createLeadModel } from './lead-validator';
import { LogLead } from "../../mongo/index";
import { IPayloadUpdate } from "./lead";
import * as Faker from 'faker';
import * as _ from 'lodash';
import { SlackAlert, ManulifeErrors as Ex, ManulifeErrors } from "../../common/index";
export default class LeadController {

    private database: IDatabase;
    private configs: IServerConfigurations;
    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async findById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: {
                    CampId: 1,
                    Phone: '+841603248887',
                    Name: Faker.name.firstName(),
                    Age: _.sample([1, 2, 3, 4]),
                    Gender: 1,
                    IncomMontly: _.sample([1, 2, 3, 4]),
                    MaritalStatus: 1,
                    Address: 'Quận 8',
                    City: 1,
                    District: 1,
                    Relationship: _.sample([1, 2, 3, 4]),
                    source: 1,
                    LeadType: 1,
                    ProcessStep: 1,
                    Description: 'lorem...',
                    StatusProcessStep: 1,
                    Status: false
                }
            };
            reply(res);
            // let idEvent = parseInt(request.params.id, 10);
            // let lead: any = await LeadService.findById(idEvent);
            // if (lead == null) {
            //     return reply({
            //         status: HTTP_STATUS.NOT_FOUND,
            //         data: null,
            //     }).code(HTTP_STATUS.NOT_FOUND);
            // } else {
            //     return reply({
            //         status: HTTP_STATUS.OK,
            //         data: lead,
            //     }).code(HTTP_STATUS.OK);
            // }
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
                        code: Ex.EX_GENERAL,
                        msg: 'find lead have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'findById',
                dataInput: {
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
     *  get transaction of leadid
     */
    public async histories(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    CampId: 1,
                    Phone: '+841603248887',
                    Name: Faker.name.firstName(),
                    Age: _.sample([1, 2, 3, 4]),
                    Gender: 1,
                    IncomMontly: _.sample([1, 2, 3, 4]),
                    MaritalStatus: 1,
                    Address: 'Quận 8',
                    City: 1,
                    District: 1,
                    Relationship: _.sample([1, 2, 3, 4]),
                    source: 1,
                    LeadType: 1,
                    ProcessStep: 1,
                    Description: 'lorem...',
                    StatusProcessStep: 1,
                    Status: false
                }]
            };
            reply(res);
            // let idEvent = parseInt(request.params.id, 10);
            // let lead: any = await LeadService.findById(idEvent);
            // if (lead == null) {
            //     return reply({
            //         status: HTTP_STATUS.NOT_FOUND,
            //         data: null,
            //     }).code(HTTP_STATUS.NOT_FOUND);
            // } else {
            //     return reply({
            //         status: HTTP_STATUS.OK,
            //         data: lead,
            //     }).code(HTTP_STATUS.OK);
            // }
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
                        code: Ex.EX_GENERAL,
                        msg: 'find lead have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'findById',
                dataInput: {
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
    public async list(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    Id: 1,
                    Phone: '+841603248887',
                    ProcessStep: 1,
                    StatusProcessStep: 1,
                    Name: Faker.name.firstName(),
                    activities: [{
                        Id: 1,
                        ProcessStep: 1,
                        Type: 1,
                        StartDate: '2018-01-26',
                        EndDate: '2018-01-26',
                        FullDate: true,
                    }]
                }, {
                    Id: 2,
                    Phone: '+841603248888',
                    ProcessStep: 1,
                    StatusProcessStep: 2,
                    Name: Faker.name.firstName(),
                    activities: [{
                        Id: 1,
                        ProcessStep: 1,
                        Type: 1,
                        StartDate: '2018-01-26',
                        EndDate: '2018-01-26',
                        FullDate: true,
                    }]
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
                        code: ManulifeErrors.EX_GENERAL,
                        msg: 'update activity have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'get list activity',
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
        * get list leads reject by campaignid, filter by processstep
        */
    public async getLeadsReject(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let processStep = parseInt(request.params.processstep, 10);
            let campaignId = parseInt(request.params.campid, 10);
            let leads: any = await LeadService.getLeadReject(campaignId, processStep);
            reply({
                status: HTTP_STATUS.OK,
                data: leads
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
                        code: ManulifeErrors.EX_GENERAL,
                        msg: 'get leads reject errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'get leads reject errors',
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
     * create lead
     * @param request  payload
     * @param reply lead
     */
    public async update(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    CampId: 1,
                    Phone: '+841603248887',
                    Name: Faker.name.firstName(),
                    Age: _.sample([1, 2, 3, 4]),
                    Gender: 1,
                    IncomMontly: _.sample([1, 2, 3, 4]),
                    MaritalStatus: 1,
                    Address: 'Quận 8',
                    City: 1,
                    District: 1,
                    Relationship: _.sample([1, 2, 3, 4]),
                    source: 1,
                    LeadType: 1,
                    ProcessStep: 1,
                    Description: 'lorem...',
                    StatusProcessStep: 1,
                    Status: false
                }]
            };
            reply(res);
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
                    error: { code: Ex.EX_GENERAL, msg: 'Create lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'update lead',
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
    * update status lead
    */
    public async updateStatus(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: [{
                    CampId: 1,
                    Phone: '+841603248887',
                    Name: Faker.name.firstName(),
                    Age: _.sample([1, 2, 3, 4]),
                    Gender: 1,
                    IncomMontly: _.sample([1, 2, 3, 4]),
                    MaritalStatus: 1,
                    Address: 'Quận 8',
                    City: 1,
                    District: 1,
                    Relationship: _.sample([1, 2, 3, 4]),
                    source: 1,
                    LeadType: 1,
                    ProcessStep: 1,
                    Description: 'lorem...',
                    StatusProcessStep: 1,
                    Status: false
                }]
            };
            reply(res);
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
                    error: { code: Ex.EX_GENERAL, msg: 'Create lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'update lead',
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
     * create lead
     * @param request  payload
     * @param reply lead
     */
    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: {
                    success: 5,
                    fail: 0,
                    total: 5
                }
            };
            reply(res);
            // let iLead = request.payload as ILead;
            // let lead: any = await LeadService.create(iLead)
            //     .catch(ex => {
            //         throw ex;
            //     });
            // // log mongo create success
            // reply({
            //     status: HTTP_STATUS.OK,
            //     data: lead
            // }).code(HTTP_STATUS.OK);
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
                    error: { code: 'ex', msg: 'Create lead have errors' }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogLead.create({
                type: 'create lead',
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
