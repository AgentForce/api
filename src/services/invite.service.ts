import { Event } from '../postgres';
import { UserService, IIUser } from './user.service';
import { Invite } from '../postgres/invite';

interface IInvite {

    UserId: number;
    LeadId: number;
    ProcessStep: number;
    UserIdInvite: number;
    Description: string;
    ReportTo: number;
    ReportToList: Array<number>;
    Status: number;
    IsDeleted: boolean;
}
class InviteService {

    /**
     * list all invite of userid
     * @param userId number
     */
    static async findbyUserId(userId) {
        try {
            let events = await Invite.findAll({
                where: {
                    UserId: userId,
                    IsDeleted: false
                }
            });
            return events;
        } catch (error) {
            throw error;
        }
    }

    /**
     * get invite by id
     * @param id number
     */
    static async findById(id) {
        try {
            let events = await Invite.findAll({
                where: {
                    Id: id,
                    IsDeleted: false
                }
            });
            return events;
        } catch (error) {
            throw error;
        }
    }


    /**
     * Tạo mới invite
     * @param invite IIvite
     */
    static async create(mevent: IInvite) {
        try {
            let user: any = await UserService.findById(mevent.UserId);
            if (user != null) {
                mevent.ReportTo = user.ReportTo;
                mevent.ReportToList = user.ReportToList;
                let eventDb: IInvite = <IInvite>await Invite.create(mevent);
                return eventDb;
            } else {
                throw [4, 'userid not found'];
            }
        } catch (ex) {
            throw ex;
        }
    }
}
export { IInvite, InviteService };