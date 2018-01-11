import { Campaign } from '../postgres';
import { UserService, IIUser } from '../services/user.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Sequelize } from 'sequelize';

import { Promise as Bluebird } from 'bluebird';
import { use } from 'nconf';
import { Lead } from '../postgres/lead';
import { log } from 'util';
import { Logger, transports, Winston } from 'winston';
import { LogCamp } from '../mongo';
import { ManulifeErrors as Ex } from '../helpers/code-errors';
import { IPayloadUpdate } from '../controller/campaigns/campaign';

import redis from '../cache/redis';
import { max } from 'moment';
import { db } from '../postgres/db';
interface ICampaign {
    UserId?: number;
    Period?: number;
    CampType?: number;
    Label?: string;
    Experience?: string;
    Name?: string;
    StartDate?: Date;
    EndDate?: Date;
    TargetCallSale?: number;
    TargetMetting?: number;
    TargetPresentation?: number;
    TargetContractSale?: number;
    CommissionRate?: number;
    CaseSize?: number;
    IncomeMonthly?: number;
    CurrentCallSale?: number;
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

// var logger = new (Logger)({
//     transports: [
//         new (transports.Console)({ level: 'error' }),
//         new (transports.File)({
//             filename: 'somefile.log',
//             level: 'info'
//         }),
//     ]
// });

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

    /**
     * get total campaign of a user
     * @key: userid
     */
    static getTotalCamp(key: string) {
        return new Promise((resolve, reject) => {
            redis.hgetall(`campaign-total:userid${key}`, async (err, res) => {
                if (err) {
                    throw err;
                }
                console.log(res);
                if (res) {
                    resolve(res);
                } else {
                    // TODO: recache
                    // get 1 record campaign have NumGoal max
                    const maxNumGoal = await Campaign.max('NumGoal', {
                        where: {
                            UserId: key
                        }
                    });
                    if (_.isInteger(maxNumGoal)) {
                        console.log(`max is ${max}`);
                        const campsLastUser: Array<ICampaign> = await Campaign.findAll({
                            where: {
                                UserId: key,
                                NumGoal: maxNumGoal,
                                IsDeleted: false
                            },
                            order: [
                                ['StartDate', 'DESC']
                            ]
                        }) as Array<ICampaign>;
                        let campTotal = {
                            UserId: key,
                            TargetCallSale: 0,
                            TargetMetting: 0,
                            TargetPresentation: 0,
                            TargetContractSale: 0,
                            IncomeMonthly: 0,
                            CurrentCallSale: 0,
                            CurrentMetting: 0,
                            CurrentPresentation: 0,
                            CurentContract: 0,
                            StartDate: null,
                            EndDate: null
                        };
                        campTotal.StartDate = _.first(campsLastUser).StartDate;
                        campTotal.EndDate = _.last(campsLastUser).EndDate;
                        _.reduce(campsLastUser, (campTotal, value: any, key) => {
                            campTotal.TargetCallSale += value.TargetCallSale;
                            campTotal.TargetMetting += value.TargetMetting;
                            campTotal.TargetPresentation += value.TargetPresentation;
                            campTotal.TargetContractSale += value.TargetContractSale;
                            return campTotal;
                        }, campTotal);
                        this.cacheCampTotal(campTotal);
                        resolve(campTotal);
                    }
                }
                // dont exist any camp
                resolve(null);
            });
        });
    }


    /**
         * find campaign by
         * @param id userid
         */
    static findByIdAndDate(campId: number, date: Date) {
        return Campaign
            .findOne({
                where: {
                    Id: campId,
                    IsDeleted: false,
                    EndDate: {
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
        db
            .query('select * from manulife_users ',
            { replacements: { email: 42 } })
            .then(v => console.log(v));

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
     * return leads of campaign, filter by processtep
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
     * Update current number of a campaign
     */
    static updateCurrent(campid: number, payload: IPayloadUpdate) {
        return this
            .findById(campid)
            .then((campDb: ICampaign) => {
                if (campDb == null) {
                    throw { code: Ex.EX_CAMPID_NOT_FOUND, msg: 'campaignid not found' };
                }
                if (campDb.EndDate < moment().toDate()) {
                    throw { code: Ex.EX_CAMP_FINISH, msg: 'campaign completed' };
                }
                return Campaign
                    .update(payload, {
                        where: {
                            Id: campid
                        },
                        returning: true
                    })
                    .then(result => {
                        return result;
                    });
            })
            .catch(ex => {
                throw ex;
            });
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
                    throw ({
                        code: Ex.EX_USERNAME_NOT_FOUND,
                        msg: 'UserId not found'
                    });
                }
                if (_.size(camps) > 0) {
                    throw ({
                        code: Ex.EX_CAMP_FINISH,
                        msg: `this user have campaign in ${campaign.StartDate}.`
                    });
                }
                let campsPrepare = <Array<ICampaign>>await this.prepareCamp(campaign, user)
                    .catch(ex => {
                        throw ex;
                    });
                let campsPostgres = await Campaign.bulkCreate(campsPrepare, {
                    returning: true,
                })
                    .catch(ex => {
                        throw ex;
                    });
                // TODO: cache campaign total
                let campTotal = {
                    UserId: campaign.UserId,
                    TargetCallSale: 0,
                    TargetMetting: 0,
                    TargetPresentation: 0,
                    TargetContractSale: 0,
                    IncomeMonthly: 0,
                    CurrentCallSale: 0,
                    CurrentMetting: 0,
                    CurrentPresentation: 0,
                    CurentContract: 0,
                    StartDate: campaign.StartDate,
                    EndDate: moment(campaign.StartDate).add(12, 'M').endOf('d').toDate()
                };
                _.reduce(campsPostgres, (campTotal, value: any, key) => {
                    campTotal.TargetCallSale += value.TargetCallSale;
                    campTotal.TargetMetting += value.TargetMetting;
                    campTotal.TargetPresentation += value.TargetPresentation;
                    campTotal.TargetContractSale += value.TargetContractSale;
                    return campTotal;
                }, campTotal);
                this.cacheCampTotal(campTotal);

                return campsPostgres;
            })
            .catch(async (ex) => {
                throw ex;
            });
    }

    private static prepareCamp(campaign: ICampaign, user: IIUser) {
        return new Promise((resolve, reject) => {
            campaign.ReportTo = user.ReportTo;
            campaign.ReportToList = user.ReportToList;
            let camps = [];
            // TODO: number contract
            // (Thu nhập x 100 / tỉ lệ hoa hồng)/loan
            let numContract = Math.ceil((campaign.IncomeMonthly * 100 / campaign.CommissionRate) / campaign.CaseSize);
            let campTotal = _.clone(campaign);
            campTotal.Period = 13;
            campTotal.Name = 'Camp total';
            campTotal.TargetCallSale = numContract * 10 * 12;
            campTotal.TargetMetting = numContract * 5 * 12;
            campTotal.TargetPresentation = numContract * 3 * 12;
            campTotal.TargetContractSale = numContract * 12;
            campTotal.EndDate = moment(campaign.StartDate).add(12, 'M').endOf('d').toDate();
            camps = _.times(12, (val) => {
                let camp: ICampaign = _.clone(campaign);
                camp.Period = val + 1;
                camp.StartDate = moment(campaign.StartDate).add(val, 'M').toDate();
                camp.EndDate = moment(campaign.StartDate).add(val + 1, 'M').subtract(1, 'd').endOf('d').toDate();

                camp.Name = `Camp ${val + 1}`;
                camp.TargetCallSale = numContract * 10;
                camp.TargetMetting = numContract * 5;
                camp.TargetPresentation = numContract * 3;
                camp.TargetContractSale = numContract;

                // TODO: default before months full target
                if (moment(camp.StartDate).unix() < moment().startOf('date').unix()) {
                    camp.CurrentCallSale = camp.TargetCallSale;
                    camp.CurrentMetting = camp.TargetMetting;
                    camp.CurrentPresentation = camp.TargetPresentation;
                    camp.CurentContract = camp.TargetContractSale;
                }

                return camp;
            });
            resolve(camps);
        })
            .catch(ex => {
                throw ex;
            });
    }
    /**
     * cache total campaign
     * @param totalCampaign total campaign
     */
    private static cacheCampTotal(totalCampaign) {
        return redis.hmset(`campaign-total:userid${totalCampaign.UserId}`,
            'TargetCallSale',
            totalCampaign.TargetCallSale,
            'TargetMetting',
            totalCampaign.TargetMetting,
            'TargetPresentation',
            totalCampaign.TargetPresentation,
            'TargetContractSale',
            totalCampaign.TargetContractSale,
            'IncomeMonthly',
            totalCampaign.IncomeMonthly,
            'CurrentCallSale',
            totalCampaign.CurrentCallSale,
            'CurrentMetting',
            totalCampaign.CurrentMetting,
            'CurrentPresentation',
            totalCampaign.CurrentPresentation,
            'CurentContract',
            totalCampaign.CurentContract,
            'StartDate',
            moment(totalCampaign.StartDate).format('YYYY-MM-DD'),
            'EndDate',
            moment(totalCampaign.EndDate).format('YYYY-MM-DD')
            , (err, res) => {
                if (err) {
                    throw err;
                }
                console.log(res);
            });
    }
}

export { ICampaign, CampaignService };