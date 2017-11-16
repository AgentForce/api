'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_events', {
      Id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
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
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};