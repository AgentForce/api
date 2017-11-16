import { Lead } from '../postgres/lead';

interface ILead {
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
     * Tạo mới lead
     * @param lead lead
     */
    static create(lead: ILead) {
        return new Promise(async (resolve, reject) => {
            let existLead = await this.findByPhone(lead.Phone);
            if (existLead == null) {
                Lead.create(lead)
                    .then(rs => {
                        resolve(rs);
                    })
                    .catch(ex => {
                        reject(ex);
                    });
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