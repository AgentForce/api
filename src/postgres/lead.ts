import { db } from './db';
// const Sequelize = require('sequelize');
import * as Sequelize from 'sequelize';
const Campaign = db.define('manulife_camps_sale', {
  id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'manulife_users',
      key: 'id',
      as: 'userId',
    }
  },
  campId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'manulife_camps_sales',
      key: 'id',
      as: 'campId',
    }
  },
  phone: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  name: {
    allowNull: true,
    type: Sequelize.STRING(255),
  },
  age_c: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  gender: {
    allowNull: false,
    type: Sequelize.STRING(50)
  },
  income_monthly__c: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  marital_status__c: {
    allowNull: true,
    type: Sequelize.STRING(50),
  },
  address: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  city: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  district: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  relationship__c: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  source: {
    allowNull: false,
    type: Sequelize.STRING(50),
    //Owner, Customer, Networking event
  },
  job: {
    allowNull: false,
    type: Sequelize.STRING(250),
  },
  lead_type: {
    allowNull: false,
    type: Sequelize.STRING(50),
  },
  processStep: {
    allowNull: false,
    type: Sequelize.STRING(50),
    /*customer
      call
      metting
      presentation
      contract
    staff
      7 loại
        call
        metting
        survey
        cop
        test
        interview
        MIT*/
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING(1024),
    unique: true
  },
  reportTo: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  isStatus: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
}, {
    // tableName: 'campaign',
    // schema: 'testmanulife',
    // freezeTableName: true,
    timestamps: false
  });
export { Campaign };
