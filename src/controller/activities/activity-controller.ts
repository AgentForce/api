import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { ActivityService, IActivity } from '../../services/activity.service';
import * as HTTP_STATUS from 'http-status';
import { IPayloadCreate } from "./activity";
import { LogActivity } from "../../mongo/index";
export default class ActivitiesController {

    private database: IDatabase;
    private configs: IServerConfigurations;

    constructor(configs: IServerConfigurations, database: IDatabase) {
        this.configs = configs;
        this.database = database;
    }


    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let iAc = request.payload as IPayloadCreate;
            let lead: any = await ActivityService.create(iAc);
            // log mongo create success
            reply({
                status: HTTP_STATUS.OK,
                data: lead
            }).code(HTTP_STATUS.OK);
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
                    error: { code: 'ex', msg: 'Create activity have errors' }
                };
            }
            LogActivity.create({
                type: 'createactivity',
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


    public async updateCampaign(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        // let userId = request.auth.credentials.id;
        // let id = request.params["id"];
        // try {
        //     let campaign: ICampaign = await this.database
        //         .campaignModel
        //         .findByIdAndUpdate({
        //             _id: id,
        //             userId: userId
        //         }, {
        //             $set: request.payload
        //         }, {
        //             new: true
        //         });
        //     if (campaign) {
        //         reply(campaign);
        //     } else {
        //         reply(Boom.notFound());
        //     }
        // } catch (error) {
        //     return reply(Boom.badImplementation(error));
        // }
    }

    public async getCampaignById(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        let userId = request.auth.credentials.id;
        let id = request.params["id"];
        let campaign = await this.database
            .campaignModel
            .findOne({ _id: id, userId: userId })
            .lean(true);
        if (campaign) {
            reply(campaign);
        } else {
            reply(Boom.notFound());
        }
    }
}
