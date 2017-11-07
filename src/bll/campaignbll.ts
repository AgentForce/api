import { Campaign as CampDao } from '../postgres';
import * as _ from 'lodash';
interface ICampaign {
    id: string;
    code: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    groupId: string;
    reportToFather: number[];
    address: string;
    city: number;
    district: number;
    isStatus: number;
    reportTo: number;
}


class Campaign {
    /**
     * find campaign
     * @param id userid
     */
    static findByEmail(email: string) {
        return CampDao
            .findOne({
                where: {
                    email: email
                }
            }).then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }


    /**
     * create new user
     * @param user IUser
     */
    static async create(campaign: ICampaign) {

        return CampDao
            .create(campaign)
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }
}
export { User, IIUser };