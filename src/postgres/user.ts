import { db } from './db';
// const Sequelize = require('sequelize');
import * as Sequelize from 'sequelize';
const User = db.define('manulife_users', {
  id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    allowNull: false,
    type: Sequelize.STRING(255),
    unique: true
  },
  label: {
    allowNull: true,
    type: Sequelize.STRING(255),
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING(255),
    unique: true
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING(255),
    unique: true
  },
  phone: {
    allowNull: false,
    type: Sequelize.STRING(50),
    unique: true
  },
  fullName: {
    allowNull: false,
    type: Sequelize.STRING(255),
    unique: true
  },
  groupId: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  reportTo: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  reportToFather: {
    allowNull: false,
    type: Sequelize.ARRAY(Sequelize.INTEGER),
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

export { User };
