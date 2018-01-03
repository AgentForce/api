import { Event } from '../postgres';
import { UserService, IIUser } from './user.service';

interface IEvent {
    UserId: number;
    Address: string;
    City: number;
    District: number;
    Description: string;
    ReportTo: number;
    ReportToList: Array<number>;
}
class EventService {

    /**
     * list all event of userid
     * @param userId number
     */
    static async findbyUserId(userId) {
        try {
            let events = await Event.findAll({
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
     * get event by id
     * @param id number
     */
    static async findById(id) {
        try {
            let events = await Event.findAll({
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
     * Tạo mới event
     * @param lead IEvent
     */
    static async create(mevent: IEvent) {
        try {
            let user: any = await UserService.findById(mevent.UserId);
            if (user != null) {
                mevent.ReportTo = user.ReportTo;
                mevent.ReportToList = user.ReportToList;
                let eventDb: IEvent = <IEvent>await Event.create(mevent);
                return eventDb;
            } else {
                throw [4, 'userid not found'];
            }
        } catch (ex) {
            throw ex;
        }
    }
}
export { IEvent, EventService };