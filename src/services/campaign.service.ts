import { Campaign } from '../postgres';
import { UserService, IIUser } from '../services/user.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Promise as Bluebird } from 'bluebird';
import { use } from 'nconf';
import { Lead } from '../postgres/lead';
import { log } from 'util';
import { Logger, transports, Winston } from 'winston';
import { LogCamp } from '../mongo';
interface ICampaign {
    UserId: number;
    Period: number;
    CampType: number;
    Label: string;
    Experience: string;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    TargetCallSale: number;
    TargetMetting: number;
    TargetPresentation: number;
    TargetContractSale: number;
    CommissionRate: number;
    CaseSize: number;
    IncomeMonthly: number;
    CurrentCallSale: number;
    CurrentMetting: number;
    CurrentPresentation: number;
    CurentContract: number;
    TargetCallReCruit: number;
    TargetSurvey: number;
    TargetPamphlet: number;
    TargetCop: number;
    TargetTest: number;
    TargetInterview: number;
    TargetMit: number;
    TargetAgentCode: number;
    Description: string;
    CurrentCallRecruit: number;
    CurrentSurvey: number;
    CurrentPamphlet: number;
    CurrentCop: number;
    CurrentTest: number;
    CurrentInterview: number;
    CurrentMit: number;
    CurentTer: number;
    AgentTer: number;
    ActiveRaito: number;
    M3AARaito: number;
    AverageCC: number;
    M3AA: number;
    FypRaito: number;
    Results: number;
    ReportTo: number;
    ReportToList: Array<number>;
}
var logger = new (Logger)({
    transports: [
        new (transports.Console)({ level: 'error' }),
        new (transports.File)({
            filename: 'somefile.log',
            level: 'info'
        }),
    ]
});
class CampaignService {
    /**
     * find campaign by
     * @param id userid
     */
    static findByUserIdAndDate(id: number, date: Date) {
        return Campaign
            .findOne({
                where: {
                    UserId: id,
                    IsDeleted: false,
                    StartDate: {
                        $gte: date
                    }
                }
            })
            .catch(ex => {
                throw ex;
            });
    }



    static findByUserId(userId) {
        return Campaign
            .findAll({
                where: {
                    UserId: userId,
                    IsDeleted: false
                }
            })
            .catch(ex => {
                throw ex;
            });
    }
    /**
     * Find one campaign by campaignid
     * @param campaignId number
     */
    static findById(campaignId) {
        return Campaign
            .findOne({
                where: {
                    Id: campaignId,
                    IsDeleted: false
                }
            })
            .catch(ex => {
                throw ex;
            });

    }

    /**
     * List leads of campaign, filter by processtep
     * @param campaignId campaignid
     * @param processStep 4 step in lead
     */
    static async leadsOfcampaign(campaignId: number, processStep: number) {
        try {
            let camp = await this.findById(campaignId);
            if (camp == null) {
                return [];
            } else {
                return Lead
                    .findAll({
                        where: {
                            CampId: campaignId,
                            IsDeleted: false,
                            ProcessStep: processStep
                        }
                    });
            }
        } catch (error) {
            throw error;
        }
    }
    /**
     * create new user
     * @param user IUser
     */
    static createOfFA(campaign: ICampaign) {
        return Bluebird
            .all([
                UserService.findById(campaign.UserId),
                this.findByUserIdAndDate(campaign.UserId, campaign.StartDate)
            ])
            .spread(async (user: IIUser, camps) => {
                if (user == null) {
                    throw ({ code: 'camp_1', msg: 'UserId not found' });
                }
                if (_.size(camps) > 0) {
                    throw ({ code: 'camp_2', msg: `this user have campaign in ${campaign.StartDate}.` });
                }
                let campPrepare = <Array<ICampaign>>await this.prepareCamp(campaign, user)
                    .catch(ex => {
                        throw ex;
                    });
                let campsPostgres = await Campaign.bulkCreate(campPrepare, { returning: true })
                    .catch(ex => {
                        throw ex;
                    });
                return campsPostgres;
            })
            .catch(async (ex) => {
                let a = await LogCamp.find({});
                console.log(a);
                logger.info('test winton');
                logger.log('error', 'hello');
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

    private static prepareCamp(campaign: ICampaign, user: IIUser) {

        return new Promise((resolve, reject) => {
            campaign.ReportTo = user.ReportTo;
            campaign.ReportToList = user.ReportToList;
            let camps = [];
            let numContract = Math.ceil((campaign.IncomeMonthly * 100 / campaign.CommissionRate) / campaign.CaseSize);
            // // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
            let maxCustomers = numContract * 10;
            let campTotal = _.clone(campaign);
            campTotal.Period = 13;
            campTotal.Name = 'Camp total';
            campTotal.TargetCallSale = numContract * 5 * 12;
            campTotal.TargetMetting = numContract * 3 * 12;
            campTotal.TargetContractSale = numContract * 12;
            campTotal.EndDate = moment(campaign.StartDate).add(12, 'M').endOf('d').toDate();
            camps = _.times(12, (val) => {
                let camp: ICampaign = _.clone(campaign);
                camp.Period = val + 1;
                camp.StartDate = moment(campaign.StartDate).add(val, 'M').toDate();
                // camp.EndDate = moment(campaign.StartDate).add(12, 'M').endOf('d').toDate();
                camp.TargetCallSale = numContract * 5;
                // dataInput.meetingCustomers = dataInput.contracts * 3;
                camp.TargetMetting = numContract * 3;
                camp.Name = `Camp ${val + 1}`;
                camp.TargetContractSale = numContract;
                return camp;
            });
            camps.push(campTotal);
            resolve(camps);
        })
            .catch(ex => {
                throw ex;
            });
    }
}
export { ICampaign, CampaignService };