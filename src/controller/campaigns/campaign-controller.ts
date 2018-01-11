import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { CampaignService, ICampaign } from '../../services/campaign.service';
import * as HTTP_STATUS from 'http-status';
import { createCampaignFAModel } from './campaign-validator';
import { Campaign } from "../../postgres/campaign";
import { LogCamp } from "../../mongo/index";
import { IPayloadUpdate } from "./campaign";
import * as _ from 'lodash';
import { SlackAlert, ManulifeErrors as Ex } from "../../helpers/index";
export default class CampaignController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    /**
     * creat a new campaign
     */
    public async createCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
        try {
            let iCamp: ICampaign = request.payload;
            const camps = <any>await CampaignService.createOfFA(iCamp);
            let logcamps = _.map(camps, (camp: any) => {
                return {
                    type: 'createcampaign',
                    dataInput: {
                        payload: request.payload
                    },
                    msg: 'success',
                    meta: {
                        response: camp.dataValues
                    },
                };
            });
            // save mongo log
            LogCamp
                .insertMany(logcamps);
            reply({
                status: HTTP_STATUS.OK,
                data: camps
            }).code(200);

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
                        msg: 'Create campaign have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'createcampaign',
                dataInput: {
                    payload: request.payload
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
     * get total campaign info from cache
     * parameter:
     * @key: userid-yyyy
     */
    public async getTotalCamp(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let key = request.params.key;
            console.log(key);
            let obj = await CampaignService.getTotalCamp(key);
            if (obj) {
                reply({
                    status: HTTP_STATUS.OK,
                    data: obj,
                }).code(HTTP_STATUS.OK);
            } else {
                reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    msg: 'not found anything'
                }).code(HTTP_STATUS.NOT_FOUND);
            }
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
                        code: Ex.EX_GENERAL,
                        msg: 'get camptotal have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'leadsOfCamp',
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
     *  list leads of a campaign
     */
    public async leadsOfCamp(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let campId = parseInt(request.params.id, 10);
            let type = parseInt(request.params.type, 10);
            const leads = await CampaignService.leadsOfcampaign(campId, type);
            reply({
                status: 200,
                leads: leads
            }).code(200);
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
                        msg: 'get leadsOfCamp have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'leadsOfCamp',
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

    private bk() {
        // 2. Checking permision create camp : start join and end of year (after finish 12 months)
        // let currentCamps = await db.Language
        //     .findAll()
        //     .catch((error) => {
        //         throw ('CreateCamp Step 2:' + JSON.stringify(error));
        //     });
        // if (currentCamps.length === 0) {
        //     // 3. Accouting Số khách hàng tiềm năng phải có (x10), hẹn gặp (x5) , Tư vấn trực tiếp (x3), chốt HD (x1)
        //     dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
        //     // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
        //     dataInput.maxCustomers = dataInput.contracts * 10;
        //     dataInput.callCustomers = dataInput.contracts * 5;
        //     dataInput.meetingCustomers = dataInput.contracts * 3;
        //     // 4. Insert DB (12 months ~ 12 new camps)
        //     let listCamps = [];
        //     // Xử lý date
        //     const currentDate = moment().format('DD-MM-YYYY');
        //     const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        //     await Promise.all(
        //         months.map(async (index) => {
        //             await listCamps.push({
        //                 name: "Camp ",
        //                 ownerid: '0057F000000eEkSQAU', policy_amount__c: dataInput.loan,
        //                 commission_rate__c: dataInput.commission,
        //                 actual_collected__c: dataInput.monthly,
        //                 startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
        //                 enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
        //                 target_contacts__c: dataInput.maxCustomers,
        //                 leads__c: dataInput.meetingCustomers,
        //                 opportunities__c: dataInput.callCustomers,
        //                 number_of_contracts_closed_in_period__c: dataInput.contracts
        //             });
        //         })
        //     );
        //     return reply(listCamps).code(201);
        // } else {
        //     return reply('Campaigns exist!!!').code(200);
        // }
    }


    /**
     * get by campaignid
     */
    public async getByCampaignId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let campid = request.params.id;
            let campaign: any = await CampaignService.findById(campid);
            if (campaign == null) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: campaign
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: campaign
                }).code(HTTP_STATUS.OK);
            }
        } catch (ex) {
            // log mongo create fail
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
                        msg: 'get getByCampaignId have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'getByCampaignId',
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
     * get list campaign of userid
     */
    public async getByUserId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let UserId = request.params.userid;
            let campaigns: any = await CampaignService.findByUserId(UserId);
            if (campaigns == null) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: campaigns
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: campaigns
                }).code(HTTP_STATUS.OK);
            }
        } catch (ex) {
            // log mongo create fail
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
                        msg: 'get getByUserId have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'getByUserId',
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
}
