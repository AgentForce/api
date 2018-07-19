import { Activity } from '../postgres';
import { IPayloadCreate, IPayloadUpdate } from '../controller/activities/activity';
import { LeadService, ILead } from './lead.service';
import { UserService, IIUser } from './user.service';
import { Lead } from '../postgres/lead';
import { ManulifeErrors as Ex } from '../common/code-errors';
import { Campaign } from '../postgres/campaign';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Constants, SlackAlert } from '../common';
import { IActivity } from './activity.service';
import { ITarget } from './IDashboard';
import * as bluebird from 'bluebird';
import { CampaignService } from './campaign.service';

type typeTarget = (
    "year" | "years" | "y" |
    "month" | "months" | "M" |
    "week" | "weeks" | "w"
);

class DashboardService {

    /**
     * Get target dashboard by week, month, year
     * @param type typeTarget
     * @param userId userid
     */
    static async campDashboard(type: typeTarget, userId: number) {
        let camp: any = {};
        let period = 0;
        let target: ITarget = {
            TargetCallSale: 0,
            TargetContractSale: 0,
            TargetMetting: 0,
            TargetPresentation: 0,
            CurrentCallSale: 0,
            CurrentMetting: 0,
            CurrentPresentation: 0,
            CurrentContract: 0
        };
        if (type === 'month' || type === 'week') {

            camp = await Campaign
                .findOne({
                    where: {
                        UserId: userId,
                        StartDate: {
                            $lte: moment().toDate()
                        },
                        EndDate: {
                            $gte: moment().toDate()
                        }
                    },
                    attributes: [
                        'Id',
                        'UserId',
                        'Period',
                        'CampType',
                        'StartDate',
                        'EndDate',
                        'TargetCallSale',
                        'TargetMetting',
                        'TargetPresentation',
                        'TargetContractSale',
                        'CurrentCallSale',
                        'CurrentMetting',
                        'CurrentPresentation',
                        'CurrentContract',
                        'TargetCallReCruit',
                        // 'TargetSurvey',
                        'CurrentCallRecruit',
                        // 'CurrentSurvey'
                    ]
                });

            if (camp === null) {
                throw {
                    code: Ex.EX_DASHBOARD_CAMP_NOT_FOUND,
                    msg: `campaign not found`
                };
            }
            period = camp.Period;

            // TODO:
            if (type === 'week') {
                target.TargetCallSale = camp.TargetCallSale / 4;
                target.TargetMetting = camp.TargetMetting / 4;
                target.TargetPresentation = camp.TargetPresentation / 4;
                target.TargetContractSale = camp.TargetContractSale / 4;

                // TODO: xử lý current
                // target.CurrentMetting =
            } else if (type === 'month') {
                target.TargetCallSale = camp.TargetCallSale;
                target.TargetMetting = camp.TargetMetting;
                target.TargetPresentation = camp.TargetPresentation;
                target.TargetContractSale = camp.TargetContractSale;

                // TODO: xử lý current
                // target.CurrentMetting =
            }

            // .then(async (camp: any) => {
            //     if (camp === null) {
            //         throw {
            //             code: Ex.EX_DASHBOARD_CAMP_NOT_FOUND,
            //             msg: `campaign not found`
            //         };
            //     }
            // });
        } else {
            camp = await CampaignService.getTotalCamp(userId.toString());
            period = 13;
            target.TargetCallSale = camp.TargetCallSale;
            target.TargetMetting = camp.TargetMetting;
            target.TargetPresentation = camp.TargetPresentation;
            target.TargetContractSale = camp.TargetContractSale;
        }
        return { period: period, target: target };

    }

    static async activitiesDashboard(type: typeTarget, userId: number) {
        try {
            let activities = await Activity
                .findAll({
                    where: {
                        UserId: userId,
                        IsDeleted: false,
                        StartDate: {
                            $gte: moment().startOf(type).toDate()
                        },
                        EndDate: {
                            $lte: moment().endOf(type).toDate()
                        }
                    },
                    attributes: {
                        exclude: ['IsDeleted']
                    },
                    order: [
                        ['CreatedAt', 'DESC']
                    ],
                    limit: 7
                });
            return activities;

        } catch (error) {
            throw {
                error,
                msg: 'Error function activitiesDashboard'
            };
        }
    }

    /**
     * dash board in current
     */
    static async dashboard(type: typeTarget, userId: number) {
        return bluebird
            .all([
                this.campDashboard(type, userId),
                this.activitiesDashboard(type, userId)
            ])
            .spread((camp: any, activities) => {
                let response = {
                    targetType: type,
                    target: camp.target,
                    period: camp.period,
                    activities: activities
                };
                return response;
            })
            .catch(ex => {
                throw ex;
            });


    }

}
export { DashboardService, typeTarget };
