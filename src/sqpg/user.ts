import * as Sequelize from 'sequelize';

export interface UserAttributes {
  ownerid?: string;
  policy_amount__c?: number;
  name?: string;
  commission_rate__c?: number;
  actual_collected__c?: number;
  target_contacts__c?: number;
  leads__c?: number;
  opportunities__c?: number;
  number_of_contracts_closed_in_period__c?: number;
  startdate?: Date;
  enddate?: Date;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes> {
  ownerid: string;
  policy_amount__c: number;
  name: string;
  commission_rate__c: number;
  actual_collected__c: number;
  target_contacts__c: number;
  leads__c: number;
  opportunities__c: number;
  number_of_contracts_closed_in_period__c: number;
  startdate: Date;
  enddate: Date;
}

export default function defineUser(sequelize: Sequelize.Sequelize, DataTypes) {
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
