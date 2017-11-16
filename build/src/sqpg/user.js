"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
function defineUser(sequelize, DataTypes) {
    const User = sequelize.define('manulife_users', {
        label: DataTypes.STRING(255),
        fullname: DataTypes.STRING(50),
        code: {
            type: Sequelize.STRING(255)
        },
        password: {
            type: Sequelize.STRING(255)
        },
        email: {
            type: Sequelize.STRING(255)
        },
        phone: { type: DataTypes.STRING(50) },
        groupid: {
            type: DataTypes.INTEGER
        },
        reportToFather: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        },
        address: {
            type: DataTypes.STRING(255)
        },
        city: {
            type: DataTypes.STRING(255)
        },
        district: {
            type: DataTypes.INTEGER
        },
        isStatus: {
            type: DataTypes.INTEGER
        },
        reportTo: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
            }
        }
    });
    return User;
}
exports.default = defineUser;
//# sourceMappingURL=user.js.map