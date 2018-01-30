import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as moment from "moment";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import { CampaignService, ICampaign } from '../../services/campaign.service';
import * as HTTP_STATUS from 'http-status';
import { createCampaignFAModel } from './relead-validator';
import { Campaign } from "../../postgres/campaign";
import { LogCamp } from "../../mongo/index";
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
     * get
     */
    public async get(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: HTTP_STATUS.OK,
                data: {

                },
                msg: '',
                msgCode: 'get_success'
            };
            reply(res);

        } catch (ex) {

        }


    }

    /**
     * get
     */
    public async list(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: HTTP_STATUS.OK,
                data: {

                },
                msg: '',
                msgCode: 'get_success'
            };
            reply(res);

        } catch (ex) {

        }


    }

    /**
     * post
     */
    public async create(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
        try {
            let res = {
                statusCode: HTTP_STATUS.OK,
                data: {

                },
                msg: 'Create success',
                msgCode: ''
            };
            reply(res);

        } catch (ex) {

        }


    }
}
