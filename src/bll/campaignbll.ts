import { Campaign as CampDao } from '../postgres';
import { User as UserBLL } from '../bll/userbll';
import * as _ from 'lodash';
import * as moment from 'moment';

interface ICampaign {
    id: string;
    campType: string;
    name: string;
    userId: number;
    period: number;
    startDate: Date;
    endDate: Date;
    numberofleads: number;
    targetCall: number;
    targetMetting: number;
    targetPresentation: number;
    targetContract: number;
    description: string;
    commission_rate__c: number;
    policy_amount__c: number;
    income_Monthly__c: number;
    currentall: number;
    currentMetting: number;
    currentPresentation: number;
    currentContract: number;
    reportTo: number;
    isStatus: number;
}


class CampaignBLL {
    /**
     * find campaign
     * @param id userid
     */
    static findByEmail(email: string) {
        return CampDao
            .findOne({
                where: {
                    email: email
                }
            }).then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }


    /**
     * create new user
     * @param user IUser
     */
    static create(campaign: ICampaign) {
        return new Promise(async (resolve, reject) => {
            let user = await UserBLL.findById(campaign.userId);
            if (user == null) {
                reject('userId not found');
            }
            let camps = await this.prepareCamp(campaign);
            resolve(camps);
        }).catch(ex => {
            console.log('object');
            throw ex;
        });
        // dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
        // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
        // dataInput.maxCustomers = dataInput.contracts * 10;
        // dataInput.callCustomers = dataInput.contracts * 5;
        // dataInput.meetingCustomers = dataInput.contracts * 3;
        // // 4. Insert DB (12 months ~ 12 new camps)
        // let listCamps = [];
        // // Xử lý date
        // const currentDate = moment().format('DD-MM-YYYY');
        // const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        // await Promise.all(
        //     months.map(async (index) => {
        //         await listCamps.push({
        //             name: "Camp ",
        //             ownerid: '0057F000000eEkSQAU',
        //             policy_amount__c: dataInput.loan,
        //             commission_rate__c: dataInput.commission,
        //             actual_collected__c: dataInput.monthly,
        //             startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
        //             enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
        //             target_contacts__c: dataInput.maxCustomers,
        //             leads__c: dataInput.meetingCustomers,
        //             opportunities__c: dataInput.callCustomers,
        //             number_of_contracts_closed_in_period__c: dataInput.contracts
        //         });
        //     })
        // );
    }

    private static prepareCamp(campaign: ICampaign) {
        return new Promise((resolve, reject) => {
            const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let camps = [];
            camps = _.map(months, (val) => {

                // dataInput.contracts = Math.ceil((dataInput.monthly * 100 / dataInput.commission) / dataInput.loan);
                // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
                // dataInput.maxCustomers = dataInput.contracts * 10;
                // dataInput.callCustomers = dataInput.contracts * 5;
                // dataInput.meetingCustomers = dataInput.contracts * 3;
                // 4. Insert DB (12 months ~ 12 new camps)
                let listCamps = [];
                // Xử lý date
                const currentDate = moment().format('DD-MM-YYYY');
                const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
                let camp: ICampaign = campaign;
                return camp;
                // await Promise.all(
                //     months.map(async (index) => {
                //         await listCamps.push({
                //             name: "Camp ",
                //             ownerid: '0057F000000eEkSQAU',
                //             policy_amount__c: dataInput.loan,
                //             commission_rate__c: dataInput.commission,
                //             actual_collected__c: dataInput.monthly,
                //             startdate: moment().add(index, 'M').format('MM/DD/YYYY'),
                //             enddate: moment().add(index + 1, 'M').format('MM/DD/YYYY'),
                //             target_contacts__c: dataInput.maxCustomers,
                //             leads__c: dataInput.meetingCustomers,
                //             opportunities__c: dataInput.callCustomers,
                //             number_of_contracts_closed_in_period__c: dataInput.contracts
                //         });
                //     })
                // );
            });
            resolve(camps);
        });
    }
}
export { ICampaign, CampaignBLL };