import { User } from '../postgres';
import * as _ from 'lodash';
import { IPayloadCreate, IPayloadChangePass } from '../controller/users/user';
import * as Bcrypt from "bcryptjs";
import { ManulifeErrors as Ex } from '../helpers/code-errors';
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
    /**
     * Check if user exist
     */
    static findByUsernameEmail(username: string, email: string) {
        return User
            .findOne({
                where: {
                    $or: [{
                        Email: email,
                    }, {
                        UserName: username
                    }
                    ]
                }
            })
            .catch(ex => {
                throw ex;
            });
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
                },
                attributes: {
                    exclude: ['IsDeleted']
                }
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
                returning: true,
            })
            .catch(ex => {
                throw ex;
            });
    }

    static async changePassword(id: number, payload: IPayloadChangePass, passwordHash: string) {
        return User
            .update({
                Password: passwordHash
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
        let ReportTo = null;
        if (payload.Manager != null) {
            let parent = <any>await this.findByCode(payload.Manager);
            if (parent == null) {
                throw { code: Ex.EX_USERNAME_NOT_FOUND, msg: 'Username of manager not found' };
            } else {
                ReportTo = parent.Id;
            }
        }
        console.log(ReportTo);
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
            ReportTo: ReportTo,
            ReportToList: [],
        };
        return User
            .create(user)
            .catch(ex => {
                throw ex;
            });
    }
}
export { UserService, IIUser };