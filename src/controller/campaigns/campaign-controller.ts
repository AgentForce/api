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
export default class CampaignController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }

    public async createCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
        try {
            let iCamp: ICampaign = request.payload;
            const camps = await CampaignService.createOfFA(iCamp);
            reply({
                status: HTTP_STATUS.OK,
                data: camps
            }).code(200);
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
                        code: 'ex_payload',
                        msg: 'Create campaign have errors'
                    }
                };
            }
            LogCamp.create({
                type: 'createcampaign',
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


    public async leadsOfCamp(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let campId = parseInt(request.params.id, 10);
            let type = parseInt(request.params.type, 10);
            const leads = await CampaignService.leadsOfcampaign(campId, type);
            reply({
                status: 200,
                leads: leads
            }).code(200);
        } catch (error) {
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
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
     * update target of campaign
     * @param request reques
     * @param reply res
     */
    public async updateCurrent(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let id = parseInt(request.params.id, 10);
            let payload = request.payload as IPayloadUpdate;
            let campaign: any = await CampaignService.updateCurrent(id, payload);
            // log mongo create success
            this.database.logLead
                .create({
                    type: 'create',
                    msg: 'success',
                    dataInput: request.payload,
                    meta: {
                        data: campaign.dataValues
                    }
                });
            reply({
                status: HTTP_STATUS.OK,
                data: campaign
            }).code(HTTP_STATUS.OK);
        } catch (ex) {
            let res = {};
            if (ex.code) {
                res = {
                    status: HTTP_STATUS.BAD_GATEWAY,
                    error: ex
                };
            } else {
                res = {
                    status: HTTP_STATUS.BAD_GATEWAY,
                    error: { code: 'ex', msg: 'update campaign have errors' }
                };
            }
            LogCamp.create({
                type: 'updatecamp',
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
        } catch (error) {
            // log mongo create fail
            this.database.logModel
                .create({
                    type: 'getByCampaignId',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
        }
    }


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
        } catch (error) {
            // log mongo create fail
            this.database.logModel
                .create({
                    type: 'getByCampaignId',
                    msg: 'fail',
                    dataInput: request.payload,
                    meta: {
                        error
                    }
                });
            return reply({
                status: 400,
                error: error
            }).code(HTTP_STATUS.BAD_REQUEST);
        }
    }
}
