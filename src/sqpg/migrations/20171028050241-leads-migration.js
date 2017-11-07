'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_leads', {
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
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('manulife_leads');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};