import { Activity } from '../postgres';
import { IPayloadCreate, IPayloadUpdate } from '../controller/activities/activity';
import { CampaignService } from './campaign.service';
import { LeadService, ILead } from './lead.service';
import { UserService, IIUser } from './user.service';
import { Lead } from '../postgres/lead';
import { ManulifeErrors as Ex } from '../helpers/code-errors';
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
                    Name: payload.ProcessStep.toString(),
                    Type: lead.ProcessStep,
                    ReportToList: user.ReportToList,
                    FullDate: payload.FullDate,
                    Location: payload.Location,
                    Notification: payload.Notification,
                    ReportTo: user.ReportTo,
                    Status: 1,
                    StartDate: payload.StartDate,
                    ProcessStep: payload.ProcessStep,
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
        return Activity
            .findOne({
                where: {
                    Id: activityId,
                    IsDeleted: false
                }
            })
            .then(activity => {
                if (activity == null) {
                    throw {
                        code: Ex.EX_ACTIVITYID_NOT_FOUND,
                        msg: 'ActivityId not found'
                    };
                }
                return Activity
                    .update(payload, {
                        where: {
                            Id: activityId
                        },
                        returning: true
                    }).then(acDb => {
                        return acDb[1];
                    });
            })
            .catch(ex => {
                throw ex;
            });
    }
}
export { IActivity, ActivityService };
