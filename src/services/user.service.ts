import { User as UserDao } from '../postgres';
import * as _ from 'lodash';
interface IIUser {
    Id: string;
    Code: string;
    Password: string;
    Email: string;
    Phone: string;
    FullName: string;
    Gender: string;
    Birthday: Date;
    GroupId: string;
    ReportToList: number[];
    Address: string;
    City: number;
    District: number;
    Status: number;
    ReportTo: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}


class UserService {
    static validate() {
    }
    /**
     * find User
     * @param id userid
     */
    static findByEmail(email: string) {
        return UserDao
            .findOne({
                where: {
                    Email: email
                }
            })
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }


    /**
     * find User
     * @param id userid
     */
    static findByCode(username: string) {
        return UserDao
            .findOne({
                where: {
                    UserName: username
                }
            })
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }

    /**
     * find User by id
     * @param id 
     */
    static findById(id: number) {
        return UserDao
            .findOne({
                where: {
                    Id: id
                }
            })
            .then(result => {
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
    static async create(user: IIUser) {
        user.ReportToList = [];
        let parent = await this.findById(user.ReportTo);
        if (parent == null) {
        }
        return UserDao.create(user)
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }
}
export { UserService, IIUser };