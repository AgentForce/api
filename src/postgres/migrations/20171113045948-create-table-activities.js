'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_activities', {
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
          as: 'activities_users'
        }
      },
      CampId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_campaigns',
          key: 'Id',
          as: 'activities_campaigns'
        }
      },
      LeadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_leads',
          key: 'Id',
          as: 'activities_leads'
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
      ProcessStep: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Location: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      Date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Description: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      ReportTo: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ReportToList: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      Type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // 2 trạng thái, waiting, done
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