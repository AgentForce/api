import * as Hapi from 'hapi';
import * as Boom from 'boom';
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
import { SlackAlert, ManulifeErrors as Ex } from "../../common/index";
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
            let res = {
                statusCode: HTTP_STATUS.OK,
                data: {

                },
                msg: 'Create success'
            };
            reply(res);
            // let iCamp: ICampaign = request.payload;
            // let userId = 5;
            // const camps = <any>await CampaignService.createOfFA(iCamp, userId);
            // let logcamps = _.map(camps, (camp: any) => {
            //     return {
            //         type: 'createcampaign',
            //         dataInput: {
            //             payload: request.payload
            //         },
            //         msg: 'success',
            //         meta: {
            //             response: camp.dataValues
            //         },
            //     };
            // });
            // // save mongo log
            // LogCamp
            //     .insertMany(logcamps);
            // reply({
            //     status: HTTP_STATUS.OK,
            //     data: camps
            // }).code(200);

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
     *  Check campaign
     */
    public async checkCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 200,
                data: {
                    status: true
                }
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




    /**
     * get by campaignid
     */
    public async getByCampaignId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: HTTP_STATUS.OK,
                data: [{
                    Period: 1,
                    Week: 1,
                    TargetCallSale: 25,
                    TargetContractSale: 10,
                    TargetMetting: 5,
                    TargetPresentation: 2,
                    CurrentCallSale: 1,
                    CurrentMetting: 1,
                    CurrentPresentation: 8,
                    CurrentContract: 0
                }, {
                    Period: 1,
                    Week: 2,
                    TargetCallSale: 25,
                    TargetContractSale: 10,
                    TargetMetting: 5,
                    TargetPresentation: 2,
                    CurrentCallSale: 1,
                    CurrentMetting: 1,
                    CurrentPresentation: 8,
                    CurrentContract: 0
                }, {
                    Period: 1,
                    Week: 3,
                    TargetCallSale: 25,
                    TargetContractSale: 10,
                    TargetMetting: 5,
                    TargetPresentation: 2,
                    CurrentCallSale: 1,
                    CurrentMetting: 1,
                    CurrentPresentation: 8,
                    CurrentContract: 0
                }, {
                    Period: 1,
                    Week: 4,
                    TargetCallSale: 25,
                    TargetContractSale: 10,
                    TargetMetting: 5,
                    TargetPresentation: 2,
                    CurrentCallSale: 1,
                    CurrentMetting: 1,
                    CurrentPresentation: 8,
                    CurrentContract: 0
                }]
            };
            reply({
                statusCode: 200,
                data: res,
            });
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
