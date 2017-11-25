import { User } from '../postgres';
import * as _ from 'lodash';
import { IPayloadCreate } from '../controller/users/user';
interface IIUser {
    Password: string;
    Email: string;
    Phone: string;
    UserName: string;
    FullName: string;
    Gender: string;
    Birthday: Date;
    GroupId: string;
    ReportToList: number[];
    Address: string;
    City: number;
    District: number;
    ReportTo: number;
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
                },
                returning: true
            })
            .catch(ex => {
                throw ex;
            });
    }

    /**
     * create new user
     * @param user IUser
     */
    static async create(payload: IPayloadCreate) {
        let parent = await this.findByCode(payload.Manager);
        if (parent == null) {
            throw { code: 'ex_user_create', msg: 'Username of manager not found' };
        } else {
            let user: IIUser = {
                Address: payload.Address,
                Birthday: payload.Birthday,
                City: payload.City,
                UserName: payload.UserName,
                Email: payload.Email,
                FullName: payload.FullName,
                District: payload.District,
                Gender: payload.Gender,
                GroupId: payload.GroupId,
                Phone: payload.Phone,
                Password: payload.Password,
                ReportTo: null,
                ReportToList: [],
            };
            return User
                .create(user)
                .catch(ex => {
                    console.log(ex);
                    throw ex;
                });
        }
    }


}
export { UserService, IIUser };