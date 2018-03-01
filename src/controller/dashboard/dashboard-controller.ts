import * as Hapi from "hapi";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { CampaignService, ICampaign } from '../../services/campaign.service';
import * as HTTP_STATUS from 'http-status';
import { Campaign } from "../../postgres/campaign";
import { LogCamp } from "../../mongo/index";
import * as _ from 'lodash';
import { SlackAlert, ManulifeErrors as Ex } from "../../common/index";
import { DashboardService, typeTarget } from "../../services/dashboard.service";
import { boomify } from "boom";
import * as Faker from 'faker';
export default class DashboardController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }



    /**
     * dashboard
     */
    public async dashboard(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {};
            if (request.params.type === 'weekmonth') {
                res = {
                    type: request.params.type,
                    currentWeek: 2,
                    campaign: [{
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
                };
            } else {
                res = {
                    type: request.params.type,
                    campaign: [
                        {
                            TargetCallSale: 100,
                            TargetMetting: 50,
                            TargetPresentation: 30,
                            TargetContractSale: 10,
                            TargetReLead: 90,
                            CurrentCallSale: 80,
                            CurrentMetting: 40,
                            CurrentPresentation: 20,
                            CurrentContract: 10,
                            CurrentReLead: 10,
                        }
                    ]
                };
            }

            reply({
                statusCode: 1,
                data: res,
                msg: '',
                msgCode: ''
            });
            // let type = request.params.type as typeTarget;
            // let UserId = 5;
            // let dashboard: any = await DashboardService.dashboard(type, UserId);
            // if (dashboard == null) {
            //     return reply({
            //         statusCode: HTTP_STATUS.NOT_FOUND,
            //         data: dashboard
            //     })
            //         .code(HTTP_STATUS.NOT_FOUND);
            // } else {

            //     return reply({
            //         statusCode: HTTP_STATUS.OK,
            //         data: dashboard
            //     }).code(HTTP_STATUS.OK);
            // }
        } catch (ex) {
            // log mongo create fail
            let res = {};
            if (ex.code) {
                res = {
                    statusCode: 0,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    statusCode: 0,
                    url: request.url.path,
                    error: {
                        code: Ex.EX_GENERAL,
                        msg: 'get dashboard have errors'
                    }
                };
            }
            SlackAlert('```' + JSON.stringify(res, null, 2) + '```');
            LogCamp.create({
                type: 'dashboard',
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
