import { User as UserDao } from '../postgres';

interface IIUser {
    id: string;
    code: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    groupId: string;
    address: string;
    city: number;
}
class User implements IIUser {
    id: string;
    code: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    groupId: string;
    address: string;
    city: number;


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
     * create new user
     * @param user IUser
     */
    static create(user: IIUser) {
        return UserDao
            .create(user)
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }
}
export { User, IIUser };