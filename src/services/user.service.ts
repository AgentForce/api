import { User } from '../postgres';
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
        return User
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
        return User
            .findOne({
                where: {
                    UserName: username
                }
            })
            .catch(ex => {
                console.log(ex);
                throw ex;
            });
    }

    /**
     * find User by id
     * @param id
     */
    static findById(id: number) {
        return User
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

    static async updateProfile(id: number, user: IIUser) {
        return User
            .update({
                Email: user.Email,
                Phone: user.Phone,
                FullName: user.FullName,
                Gender: user.Gender,
                Birthday: user.Birthday,
                Address: user.Address,
                City: user.City,
                District: user.District,
            }, {
                where: {
                    Id: id
                }
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
        return User
            .create(user)
            .catch(ex => {
                throw ex;
            });
    }
}
export { UserService, IIUser };