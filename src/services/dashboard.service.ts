import { Activity } from '../postgres';
import { IPayloadCreate, IPayloadUpdate } from '../controller/activities/activity';
import { LeadService, ILead } from './lead.service';
import { UserService, IIUser } from './user.service';
import { Lead } from '../postgres/lead';
import { ManulifeErrors as Ex } from '../helpers/code-errors';
import { Campaign } from '../postgres/campaign';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Constants, SlackAlert } from '../helpers';
import { IActivity } from './activity.service';

class DashboardService {

    /**
     * dash board in current
     */
    static async dashboard(userId: number) {
        return Campaign
            .findOne({
                where: {
                    UserId: userId
                },
                attributes: {
                    exclude: ['IsDeleted']
                }
            })
            .then(async (camp: any) => {
                if (camp === null) {
                    throw {
                        code: Ex.EX_DASHBOARD_CAMP_NOT_FOUND,
                        msg: `campaign not found`
                    };
                }
                let activities = await Activity
                    .findAll({
                        where: {
                            UserId: userId,
                            CampId: camp.Id,
                            IsDeleted: false,
                        },
                        attributes: {
                            exclude: ['IsDeleted']
                        }
                    });
                let groupActivities = {
                    call: [],
                    metting: [],
                    presentation: [],
                    close: [],
                };

                if (activities !== null) {
                    _.reduce(activities, (group, value: IActivity, key) => {
                        if (value.Type === Constants.ACTIVITY_TYPE_CALL) {
                            groupActivities.call.push(value);
                        }
                        if (value.Type === Constants.ACTIVITY_TYPE_METTING) {
                            groupActivities.metting.push(value);
                        }
                        if (value.Type === Constants.ACTIVITY_TYPE_PRESENTATION) {
                            groupActivities.presentation.push(value);
                        }
                        if (value.Type === Constants.ACTIVITY_TYPE_CLOSE) {
                            groupActivities.close.push(value);
                        }
                        return group;
                    }, groupActivities);
                }
                return { campaign: camp, activities: groupActivities };
            })
            .catch(ex => {
                throw ex;
            });

    }

}
export { DashboardService };
