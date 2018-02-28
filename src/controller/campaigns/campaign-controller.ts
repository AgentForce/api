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
import { SlackAlert, ManulifeErrors as Ex, MsgCodeResponses } from "../../common/index";
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
                statusCode: 1,
                data: {

                },
                msg: 'Create success',
                msgCode: ''
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
                    status: 0,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 0,
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
            reply(res);
        }
    }

    public async createCampaignSM(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        // 1. Router Checking data input : commission > 0, loan > 0, monthly > 0
        try {
            let res = {
                statusCode: 1,
                data: {

                },
                msg: 'Create success',
                msgCode: ''
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
                    status: 0,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 0,
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
            reply(res);
        }
    }


    /**
     * forcast
     */
    public async forcast(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {

                },
                msg: '',
                msgCode: ''
            };
            reply(res);

        } catch (ex) {
            reply(ex);
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
                    status: 1,
                    data: obj,
                });
            } else {
                reply({
                    status: 0,
                    msg: 'not found anything',
                    msgCode: '',
                });
            }
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
            reply(res);
        }
    }

    /**
     *  Check campaign
     */
    public async checkCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: 1,
                data: {
                    status: true
                },
                msg: MsgCodeResponses.CAMP_EXIST,
                msgCode: MsgCodeResponses.CAMP_EXIST
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
            reply(res);
        }
    }




    /**
     * get by campaignid
     */
    public async getByCampaignId(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let data = {};
            if (parseInt(request.params.period, 10) > 0) {
                data = {
                    statusCode: 1,
                    data: {
                        currentWeek: 2,
                        campaigns: [{
                            Period: 1,
                            Week: 1,
                            TargetCallSale: 30,
                            TargetMetting: 15,
                            TargetPresentation: 9,
                            TargetContractSale: 3,
                            TargetReLead: 27,
                            CurrentCallSale: 17,
                            CurrentMetting: 12,
                            CurrentPresentation: 7,
                            CurrentContract: 3,
                            CurrentReLead: 2,
                        }, {
                            Period: 1,
                            Week: 2,
                            TargetCallSale: 30,
                            TargetMetting: 15,
                            TargetPresentation: 9,
                            TargetContractSale: 3,
                            TargetReLead: 27,
                            CurrentCallSale: 17,
                            CurrentMetting: 12,
                            CurrentPresentation: 7,
                            CurrentContract: 3,
                            CurrentReLead: 2,
                        }, {
                            Period: 1,
                            Week: 3,
                            TargetCallSale: 30,
                            TargetMetting: 15,
                            TargetPresentation: 9,
                            TargetContractSale: 3,
                            TargetReLead: 27,
                            CurrentCallSale: 17,
                            CurrentMetting: 12,
                            CurrentPresentation: 7,
                            CurrentContract: 3,
                            CurrentReLead: 2,
                        }, {
                            Period: 1,
                            Week: 4,
                            TargetCallSale: 30,
                            TargetMetting: 15,
                            TargetPresentation: 9,
                            TargetContractSale: 3,
                            TargetReLead: 27,
                            CurrentCallSale: 17,
                            CurrentMetting: 12,
                            CurrentPresentation: 7,
                            CurrentContract: 3,
                            CurrentReLead: 2,
                        }]
                    },
                    msg: MsgCodeResponses.CAMP_EXIST,
                    msgCode: MsgCodeResponses.CAMP_EXIST
                };
                reply(data);
            } else {
                reply({
                    statusCode: 0,
                    data: {},
                    msg: MsgCodeResponses.CAMP_NOT_EXIST,
                    msgCode: MsgCodeResponses.CAMP_NOT_EXIST
                });
            }

        } catch (ex) {
            // log mongo create fail
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
            reply(res);
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
                    status: 0,
                    data: campaigns
                });
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
                    status: 0,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    status: 0,
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
            reply(res);
        }
    }
}
