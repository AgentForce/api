'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn('manulife_activities', 'StartDate', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      }),
      queryInterface.addColumn('manulife_activities', 'EndDate', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }),
      queryInterface.addColumn('manulife_activities', 'FullDate', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }),
      queryInterface.addColumn('manulife_activities', 'Repeat', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('manulife_activities', 'Notification', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.removeColumn('manulife_activities', 'Date')
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('manulife_activities', 'StartDate', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }),
      queryInterface.removeColumn('manulife_activities', 'EndDate', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }),
      queryInterface.removeColumn('manulife_activities', 'FullDate', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }),
      queryInterface.removeColumn('manulife_activities', 'Repeat', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.removeColumn('manulife_activities', 'Notification', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      })
    ]
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};