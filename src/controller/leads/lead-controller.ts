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
                statusCode: 1,
                data: {
                    Id: 4,
                    Phone: '01693248887',
                    Name: 'string',
                    Age: 1,
                    Gender: 0,
                    IncomeMonthly: 1,
                    MaritalStatus: 1,
                    Relationship: 1,
                    Source: 0,
                    LeadType: 1,
                    ProcessStep: 3,
                    Description: 'string',
                    Status: false,
                    StatusProcessStep: 2,
                    Score: 0
                },
                msgCode: 'success',
                msg: 'success'
            };
            reply(res);
        } catch (ex) {

        }
    }


    /**
     *  get transaction of leadid
     */
    public async histories(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {
                    count: 5,
                    rows: [
                        {
                            Phone: '01693248887',
                            Name: 'string',
                            Age: 1,
                            Gender: 0,
                            IncomeMonthly: 1,
                            MaritalStatus: 1,
                            Relationship: 1,
                            Source: 0,
                            LeadType: 1,
                            ProcessStep: 0,
                            Description: 'string',
                            StatusProcessStep: 0,
                            Score: 0
                        }
                    ],
                    page: 1,
                    limit: 1
                },
                msgCode: 'success',
                msg: 'success'
            };
            reply(res);

        } catch (ex) {

        }
    }


    /**
        * get list activities by campaignid, filter by processstep
        */
    public async list(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {
                    page: '1',
                    limit: '1',
                    count: 1,
                    rows: [
                        {
                            Phone: '01693248887',
                            Name: 'string',
                            Score: 0,
                            ProcessStep: 3,
                            StatusProcessStep: 2,
                            Id: 4
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
        * get list leads reject by campaignid, filter by processstep
        */
    public async getLeadsReject(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let processStep = parseInt(request.params.processstep, 10);
            let campaignId = parseInt(request.params.campid, 10);
            let leads: any = await LeadService.getLeadReject(campaignId, processStep);
            reply({
                status: 1,
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
            reply(res);
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
                statusCode: 1,
                data: true,
                msg: 'Thành công',
                msgCode: 'success'
            };
            reply(res);
        } catch (ex) {

        }
    }



    /**
    * update status lead
    */
    public async updateStatus(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: true,
                msg: 'Thành công',
                msgCode: 'success'
            };
            reply(res);
        } catch (ex) {

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
                statusCode: 1,
                data: true,
                msg: 'Thành công',
                msgCode: 'success'
            };
            reply(res);

        } catch (ex) {

        }
    }


}
