import { db } from './db';
// const Sequelize = require('sequelize');
import { IDatabase } from '../database';
import * as Sequelize from 'sequelize';
const Event = db.define('manulife_events', {
  Id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'manulife_users',
      key: 'Id',
      as: 'events_users'
    }
  },
  Address: {
    type: Sequelize.STRING(500),
    allowNull: false,
    defaultValue: ''
  },
  City: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  District: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  Description: {
    type: Sequelize.STRING(500)
  },
  ReportTo: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  ReportToList: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true
  },
  IsDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
    hooks: {
      afterCreate: (user, options) => {
        // database.logModel.create({
        //   type: 'create user',
        //   meta: {
        //     options: options,
        //     user: user
        //   }
        // });
      }
    },
    // tableName: 'campaign',
    // schema: 'testmanulife',
    // freezeTableName: true,
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

export { Event };
