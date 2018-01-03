'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_groups', {
      Id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Name: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      AddUser: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      DeleteUser: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ManageReport: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ManageEvent: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      CurrentMetting: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      CurrentPresentation: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ReportTo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ReportToList: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      IsDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('manulife_groups');
  }
};