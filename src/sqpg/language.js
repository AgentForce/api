"use strict";
exports.__esModule = true;
function defineUser(sequelize, DataTypes) {
    var Language = sequelize.define('Language', {
        label: DataTypes.STRING(255),
        name: DataTypes.STRING(50)
    }, {
        classMethods: {
            associate: function (models) {
                Language.hasMany(models.AppUser, {
                    foreignKey: 'languageId',
                    as: 'appUsers'
                });
            }
        }
    });
    return Language;
}
exports["default"] = defineUser;
