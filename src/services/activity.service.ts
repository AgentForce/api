import { Activity } from '../postgres';

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
    IsDeleted: number;
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
     * Tạo mới lead
     * @param lead lead
     */
    static create(activiy: IActivity) {
        return new Promise(async (resolve, reject) => {
            Activity.create(activiy)
                .then(rs => {
                    // Tao activity default
                    resolve(rs);
                })
                .catch(ex => {
                    reject(ex);
                });
        })
            .catch(ex => {
                throw ex;
            });

    }
}
export { IActivity, ActivityService };
