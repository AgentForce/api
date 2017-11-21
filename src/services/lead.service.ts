import { Lead } from '../postgres/lead';
import { IActivity, ActivityService } from './activity.service';
import { Promise as Bluebird } from 'bluebird';
import * as moment from 'moment';
import { UserService, IIUser } from './user.service';
import { IDatabase } from '../database';
interface ILead {
    Id: number;
    UserId: number;
    CampId: number;
    Phone: string;
    Name: string;
    Age: number;
    Gender: number;
    IncomeMonthly: number;
    MaritalStatus: number;
    Address: string;
    City: number;
    District: number;
    Relationship: number;
    Source: number;
    Job: string;
    LeadType: number;
    ProcessStep: number;
    Description: string;
}
class LeadService {
    /**
     * Tìm một lead dựa vào số điện thoại
     * @param phone string
     */
    static async findByPhone(phone: string) {
        try {
            let lead = await Lead.findOne({
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
    * Tìm một lead dựa vào số điện thoại
    * @param phone string
    */
    static async findById(phone: string) {
        try {
            let lead = await Lead.findOne({
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
     * Tạo mới lead sau đó sẽ tạo activity default cho lead này: default là hoạt động gọi
     * @param lead lead
     */
    static create(lead: ILead) {
        return new Promise(async (resolve, reject) => {
            let existLead = await this.findByPhone(lead.Phone);
            if (existLead == null) {
                let results = await Bluebird.all([
                    Lead.create(lead),
                    UserService.findById(lead.UserId)
                ]);
                let leadDb = results[0] as ILead;
                let userDb = results[1] as IIUser;
                let activity = <IActivity>{
                    CampId: leadDb.CampId,
                    Name: 'Call',
                    Phone: leadDb.Phone,
                    LeadId: leadDb.Id,
                    UserId: leadDb.UserId,
                    Type: 0,
                    Status: 0,
                    ProcessStep: 0,
                    Date: moment().toDate(),
                    ReportTo: userDb.ReportTo,
                    ReportToList: userDb.ReportToList

                };
                let activityDb = await ActivityService.create(activity)
                    .catch(ex => {
                        throw ex;
                    });
                resolve({ lead: leadDb, activity: activityDb });
            } else {
                reject([3, 'Phone exist']);
            }
        })
            .catch(ex => {
                throw ex;
            });

    }
}
export { ILead, LeadService };