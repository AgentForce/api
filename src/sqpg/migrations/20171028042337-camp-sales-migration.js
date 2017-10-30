'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_camps_sales', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      campType: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING(255),
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
      period: {
        allowNull: false,
        type: Sequelize.INTEGER,
       },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      numberofleads: {
        allowNull: true,
        type: Sequelize.INTEGER,
       },
       targetCall: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      targetMetting: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      targetPresentation: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      targetContract: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(1024),
        unique: true
      },
      commission_rate__c: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      policy_amount__c: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      income_Monthly__c: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentCall: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentMetting: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentPresentation: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      currentContract: { 
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      reportTo: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('manulife_camps_sales');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
