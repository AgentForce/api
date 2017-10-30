import * as Sequelize from 'sequelize';

export interface CampaignAttributes {
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

export interface CampaignInstance extends Sequelize.Instance<CampaignAttributes> {
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
  const Language = sequelize.define('Language', {
    label: DataTypes.STRING(255),
    name: DataTypes.STRING(50)
  }, {
      classMethods: {
        associate: function(models) {
          Language.hasMany(models.AppUser, {
            foreignKey: 'languageId',
            as: 'appUsers'
          });
        }
      }
    });
  return Language;
}
