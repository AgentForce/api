import { User as UserDao } from '../postgres';
import * as _ from 'lodash';
interface IIUser {
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
class User {
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
                    email: email
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
    static findByCode(code: string) {
        return UserDao
            .findOne({
                where: {
                    code: code
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
        return UserDao.findOne({
            where: {
                id: id
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
        user.reportToFather = [];
        let parent = await this.findById(user.reportTo);
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
export { User, IIUser };