import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { CampaignService, ICampaign } from '../../services/campaign.service';
import * as HTTP_STATUS from 'http-status';
import { Campaign } from "../../postgres/campaign";
import { LogCamp } from "../../mongo/index";
import * as _ from 'lodash';
import { SlackAlert, ManulifeErrors as Ex } from "../../helpers/index";
import { DashboardService } from "../../services/dashboard.service";
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
            let UserId = parseInt(request.params.userid, 10);
            let dashboard: any = await DashboardService.dashboard(UserId);
            if (dashboard == null) {
                return reply({
                    status: HTTP_STATUS.NOT_FOUND,
                    data: dashboard
                }).code(HTTP_STATUS.NOT_FOUND);
            } else {
                return reply({
                    status: HTTP_STATUS.OK,
                    data: dashboard
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
            reply(res).code(HTTP_STATUS.BAD_REQUEST);
        }
    }
}
