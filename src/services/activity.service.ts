import { Activity } from '../postgres';
import { IPayloadCreate, IPayloadUpdate } from '../controller/activities/activity';
import { CampaignService, ICampaign } from './campaign.service';
import { LeadService, ILead } from './lead.service';
import { UserService, IIUser } from './user.service';
import { Lead } from '../postgres/lead';
import { ManulifeErrors as Ex } from '../helpers/code-errors';
import { Campaign } from '../postgres/campaign';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Constants, SlackAlert } from '../helpers';
interface IActivity {
    UserId: number;
    CampId: number;
    LeadId: number;
    Phone: string;
    Name: string;
    ProcessStep: number;
    Location: string;
    StartDate: Date;
    EndDate: Date;
    Description: string;
    ReportTo: number;
    ReportToList: Array<number>;
    Type: number;
    Status: number;
    FullDate: boolean;
    Notification: number;


}
class ActivityService {

    /**
    * Tìm một lead dựa vào số điện thoại
    * @param phone string
    */
    static async findById(phone: string) {
        try {
            let lead = await Activity.findOne({
                where: {
                    Phone: phone,
                    IsDeleted: false
                }
            });
            return lead;
        } catch (error) {
            throw error;
        }
    }

    /**
    * list activities of a campainid, filter by processttep
    * @param campId
    * @param processStep
    */
    static async listByCampaignId(campId: number, processStep: number, limit: number, page: number) {
        try {
            let offset = limit * (page - 1);
            let activities = await Activity.findAll({
                where: {
                    ProcessStep: processStep,
                    CampId: campId,
                    IsDeleted: false
                },
                attributes: {
                    exclude: ['IsDeleted']
                },
                // number row skip
                offset: offset,
                limit: limit
            });
            return {
                data: activities,
                page: page,
                limit: limit
            };
        } catch (error) {
            throw error;
        }
    }


    /**
     * Tạo mới activiy
     * @param activiy activiy
     */
    static create(payload: IPayloadCreate) {
        return Promise.all([
            Lead.findOne({
                where: {
                    Id: payload.LeadId,
                    CampId: payload.CampId,
                    IsDeleted: false,
                    UserId: payload.UserId
                }
            }),
            UserService.findById(payload.UserId)
        ])
            .then(async (results) => {
                let lead = results[0] as ILead;
                let user = results[1] as IIUser;

                if (lead == null) {
                    throw { code: Ex.EX_LEADID_NOT_FOUND, msg: 'lead not found' };
                }
                if (user == null) {
                    throw { code: Ex.EX_USERID_NOT_FOUND, msg: 'userid not found' };
                }
                let activity: IActivity = {
                    CampId: payload.CampId,
                    Description: payload.Description,
                    EndDate: payload.EndDate,
                    Phone: lead.Phone,
                    LeadId: lead.Id,
                    Name: payload.Type.toString(),
                    Type: payload.Type,
                    ProcessStep: lead.ProcessStep,
                    ReportToList: user.ReportToList,
                    FullDate: payload.FullDate,
                    Location: payload.Location,
                    Notification: payload.Notification,
                    ReportTo: user.ReportTo,
                    Status: 1,
                    StartDate: payload.StartDate,
                    UserId: payload.UserId
                };
                let actDb = await Activity.create(activity);
                return actDb;
            })
            .catch(ex => {
                throw ex;
            });
    }


    /**
    * Update  activiy
    * @param activiy activiy
    */
    static update(activityId: number, payload: IPayloadUpdate) {
        return Promise
            .all([
                Activity
                    .findOne({
                        where: {
                            Id: activityId,
                            IsDeleted: false,
                            CampId: payload.CampId
                        }
                    }),
                CampaignService.findByIdAndDate(payload.CampId, moment().toDate())
            ])
            .then(async (result) => {
                let activity = result[0] as IActivity;
                if (activity == null) {
                    throw {
                        code: Ex.EX_ACTIVITYID_NOT_FOUND,
                        msg: `ActivityId ${activityId} not found vs campid ${payload.CampId}`
                    };
                }
                let camp = result[1] as ICampaign;
                if (camp == null) {
                    throw {
                        code: Ex.EX_CAMPID_NOT_FOUND,
                        msg: `campaign ${payload.CampId} finished or dont exist`
                    };
                }
                let updateCamp = {
                    CurrentCallSale: camp.CurrentCallSale,
                    CurentContract: camp.CurentContract,
                    CurrentMetting: camp.CurrentMetting,
                    CurrentPresentation: camp.CurrentPresentation
                };
                if (payload.Status === 1 && activity.Status === Constants.ACTIVITY_DEACTIVE) {
                    if (activity.Type === 1) {
                        updateCamp.CurrentCallSale += 1;
                    } else if (activity.Type === 2) {
                        updateCamp.CurrentMetting += 1;
                    } else if (activity.Type === 3) {
                        updateCamp.CurrentMetting += 1;
                    } else if (activity.Type === 4) {
                        updateCamp.CurrentPresentation += 1;
                    }
                } else if (payload.Status === 0 && activity.Status === Constants.ACTIVITY_ACTIVE) {
                    if (activity.Type === 1) {
                        updateCamp.CurrentCallSale -= 1;
                    } else if (activity.Type === 2) {
                        updateCamp.CurrentMetting -= 1;
                    } else if (activity.Type === 3) {
                        updateCamp.CurrentMetting -= 1;
                    } else if (activity.Type === 4) {
                        updateCamp.CurrentPresentation -= 1;
                    }
                }
                // Update activity and update current some target
                return Promise
                    .all([
                        Activity
                            .update(payload, {
                                where: {
                                    Id: activityId
                                },
                                returning: true
                            }).then(acDb => {
                                return acDb[1];
                            }),
                        Campaign
                            .update(updateCamp, {
                                returning: true,
                                where: {
                                    Id: activity.CampId
                                },
                            })
                            .then(campDb => {
                                return campDb[1];
                            })
                    ])
                    .then(rs => {
                        let obj = _.flatten(rs);
                        return { activity: obj[0], camp: obj[1] };
                    })
                    .catch(ex => {
                        throw ex;
                    });
            })
            .catch(ex => {
                throw ex;
            });
    }
}
export { IActivity, ActivityService };
