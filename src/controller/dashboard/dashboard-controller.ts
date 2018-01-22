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
            let type = request.params.type as typeTarget;
            let UserId = 5;
            let dashboard: any = await DashboardService.dashboard(type, UserId);
            if (dashboard == null) {
                return reply({
                    statusCode: HTTP_STATUS.NOT_FOUND,
                    data: dashboard
                })
                    .code(HTTP_STATUS.NOT_FOUND);
            } else {

                return reply({
                    statusCode: HTTP_STATUS.OK,
                    data: dashboard
                }).code(HTTP_STATUS.OK);
            }
        } catch (ex) {
            // log mongo create fail
            let res = {};
            if (ex.code) {
                res = {
                    statusCode: HTTP_STATUS.BAD_GATEWAY,
                    url: request.url.path,
                    error: ex
                };
            } else {
                res = {
                    statusCode: HTTP_STATUS.BAD_GATEWAY,
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
            reply(res)
                .code(HTTP_STATUS.BAD_REQUEST);
        }
    }
}
