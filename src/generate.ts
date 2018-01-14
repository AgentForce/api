import { User } from "./postgres/user";
import * as faker from 'faker';
import * as _ from 'lodash';
import { lstat } from "fs";

const genReportToList = () => {
    let lstTr = '1';
    _.times(12, (value) => {
        lstTr += `.${_.sample(_.range(2, 1000))}`;
    });
    return lstTr;
};

const genUser = (params) => {
    return {
        Address: faker.address.city(),
        Birthday: faker.date.recent(),
        City: _.sample([1, 2, 3, 4, 5]),
        UserName: params,
        Email: faker.internet.email(),
        FullName: faker.name.title(),
        District: _.sample([1, 2, 3, 4, 5, 8, 6]),
        Gender: _.sample([1, 2]),
        GroupId: 2,
        Phone: faker.phone.phoneNumber(),
        Password: faker.internet.password(),
        ReportTo: 1,
        ReportToList: genReportToList(),
        Credit: 0
    };
};



_.times(500, (pa) => {
    const users = [];
    _.times(500, (child) => {
        users.push(genUser(pa + child));
    });
    User.bulkCreate(users);
});

