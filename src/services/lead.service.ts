import { Lead } from '../postgres/lead';
import { IActivity, ActivityService } from './activity.service';
import { Promise as Bluebird } from 'bluebird';
import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import { UserService, IIUser } from './user.service';
import { IDatabase } from '../database';
import { Campaign } from '../postgres/campaign';
import { CampaignService, ICampaign } from './campaign.service';
import { IPayloadUpdate } from '../controller/leads/lead';
import { ManulifeErrors as Ex } from '../common/code-errors';
import { Activity } from '../postgres/activity';
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
     * get leads by group count processStep and where campid
     */
    static async groupProcessStepInCamp(campId: number) {
        try {
            let leads = await Lead.findAll({
                attributes: ['ProcessStep', 'CampId', [Sequelize.fn('Count', Sequelize.col('*')), 'Count']],
                where: {
                    CampId: campId,
                    IsDeleted: false,
                    Status: true, // dount count lead have reject
                },
                group: ['ProcessStep', 'CampId']
            });
            return leads;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * get list leads reject by campId, filter by processtep
     * @param phone string
     */
    static async getLeadReject(campId: number, processStep: number) {
        try {
            let leads = await Lead.findAll({
                where: {
                    CampId: campId,
                    IsDeleted: false,
                    ProcessStep: processStep,
                    Status: false
                }
            });
            return leads;
        } catch (error) {
            throw error;
        }
    }

    /**
    * list leads of a campainid, filter by processttep
    * @param campId
    * @param processStep
    */
    static async listByCampaignId(campId: number, processStep: number, limit: number, page: number) {
        try {
            let offset = limit * (page - 1);
            let activities = await Lead.findAll({
                where: {
                    ProcessStep: processStep,
                    CampId: campId,
                    IsDeleted: false,

                },
                include: [{
                    model: Activity,
                    where: {
                        IsDeleted: false,
                        ProcessStep: processStep
                    },
                    attributes: {
                        exclude: ['IsDeleted']
                    },
                }],
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
    * Tìm một lead dựa vào Id
    * @param phone string
    */
    static async findById(Id: number) {
        try {
            let lead = await Lead.findOne({
                where: {
                    Id: Id,
                    IsDeleted: false
                }
            });
            return lead;
        } catch (error) {
            throw error;
        }
    }



    static async update(leadId: number, lead: IPayloadUpdate) {
        return this
            .findById(leadId)
            .then((leadDb: ILead) => {
                if (leadDb == null) {
                    throw { code: Ex.EX_LEADID_NOT_FOUND, msg: 'Lead not found' };
                }
                if (leadDb.ProcessStep > lead.ProcessStep) {
                    throw { code: Ex.EX_LEAD_PROCESS_STEP, msg: 'cant not update processtep < old processtep' };
                }
                return Lead
                    .update(lead, {
                        where: {
                            Id: leadId
                        },
                        returning: true
                    })
                    .then(result => {
                        return result[1];
                    });
            })
            .catch(ex => {
                throw ex;
            });
    }

    /**
     * Tạo mới lead sau đó sẽ tạo activity default cho lead này: default là hoạt động gọi
     * @param lead lead
     */
    static create(lead: ILead) {
        return new Promise(async (resolve, reject) => {
            let objExists = await Bluebird.all([
                UserService.findById(lead.UserId),
                CampaignService.findByIdAndDate(lead.CampId, moment().toDate()),
                Lead.findOne({
                    where: {
                        $or: [{
                            Phone: lead.Phone,
                            UserId: {
                                $ne: lead.UserId
                            }
                        }, {
                            CampId: lead.CampId,
                            Phone: lead.Phone,
                        }
                        ]
                    }
                })
            ]);
            let userDb = objExists[0] as IIUser;
            if (userDb == null) {
                reject({ code: Ex.EX_USERID_NOT_FOUND, msg: 'UserId not found' });
            }
            let campDb = objExists[1] as ICampaign;
            if (campDb == null) {
                reject({ code: Ex.EX_CAMPID_NOT_FOUND, msg: 'Campaignid not found' });
            }
            let leadDb = objExists[2] as ILead;
            if (leadDb == null) {
                lead.ProcessStep = 1;
                let leadNew = <ILead>await Lead.create(lead);
                let activity = <IActivity>{
                    CampId: leadNew.CampId,
                    Name: 'call',
                    Phone: leadNew.Phone,
                    LeadId: leadNew.Id,
                    UserId: leadNew.UserId,
                    Type: 1,
                    Status: 0, //waiting, 1 done
                    ProcessStep: leadNew.ProcessStep,
                    StartDate: moment().toDate(),
                    EndDate: moment().add(3, 'd').startOf('day').toDate(),
                    ReportTo: userDb.ReportTo,
                    ReportToList: userDb.ReportToList
                };
                let activityDb = await ActivityService.create(activity);
                resolve({ lead: leadNew, activity: activityDb });
            } else {
                reject({ code: Ex.EX_PHONE_EXISTS, msg: 'This phone exist' });
            }
        })
            .catch(ex => {
                throw ex;
            });

    }
}
export { ILead, LeadService };