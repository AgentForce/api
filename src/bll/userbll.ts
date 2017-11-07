import db from '../sqpg/_index';
export interface IIUser {
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
export class User implements IIUser {
    id: string;
    code: string;
    password: string;
    email: string;
    phone: string;
    fullName: string;
    groupId: string;
    address: string;
    city: number;

    find() {

    }

    static create(user: IIUser) {
        console.log(user);
       return  db.User
            .create({
                code: user.id,
                password: user.password,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName
            })
            .then(result => {
                return result;
            })
            .catch(ex => {
                throw ex;
            });
    }
}