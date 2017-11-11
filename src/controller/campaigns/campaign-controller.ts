import * as Hapi from "hapi";
import * as Boom from "boom";
import * as moment from "moment";
// import { ICampaign } from "./campaign";
import { IDatabase } from "../../database";
import { IServerConfigurations } from "../../configurations";
import * as uuid from 'uuid';
// import db from '../../sqpg/_index';
// import { LanguageInstance } from './../../sqpg/language';
import { CampaignBLL, ICampaign } from '../../bll/campaignbll';
import * as HTTP_STATUS from 'http-status';
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
            const dataInput: ICampaign = request.payload;
            const camps = await CampaignBLL.create(dataInput);
            reply(camps).code(200);
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
