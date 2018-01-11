import { db } from './db';
// const Sequelize = require('sequelize');
import * as Sequelize from 'sequelize';
import { Activity } from './activity';
require('sequelize-hierarchy')(Sequelize);
const Lead = db.define('manulife_leads', {
  Id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'manulife_users',
      key: 'Id',
      as: 'leads_users'
    }
  },
  CampId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'manulife_campaigns',
      key: 'Id',
      as: 'leads_campaigns'
    }
  },
  Phone: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  Name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  Age: {
    type: Sequelize.INTEGER
  },
  Gender: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  IncomeMonthly: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  MaritalStatus: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Address: {
    type: Sequelize.STRING(255)
  },
  City: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  District: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Relationship: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Source: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Job: {
    type: Sequelize.STRING(255)
  },
  LeadType: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ProcessStep: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  Description: {
    type: Sequelize.STRING(500)
  },
  IsDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  Status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 1 // 1= active, 0 = deactive
  },
  StatusProcessStep: {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  CreatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  UpdatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
}, {
    // tableName: 'campaign',
    // schema: 'testmanulife',
    // freezeTableName: true,
    // timestamps: false
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });
Lead.hasMany(Activity, { foreignKey: 'LeadId' });
export { Lead };
