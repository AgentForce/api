import { db } from './db';
// const Sequelize = require('sequelize');
import { IDatabase } from '../database';
import * as Sequelize from 'sequelize';
const MetaType = db.define('manulife_metatypes', {
  Id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Type: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  Key: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  Value: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  IsDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  Description: {
    type: Sequelize.STRING(500),
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

export { MetaType };
