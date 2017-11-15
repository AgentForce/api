'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_leads', {
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
        default: 0
      },
      IncomeMonthly: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      MaritalStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      Address: {
        type: Sequelize.STRING(255)
      },
      City: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      District: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      Relationship: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      Source: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      Job: {
        type: Sequelize.STRING(255)
      },
      LeadType: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      ProcessStep: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0
      },
      Description: {
        type: Sequelize.STRING(500)
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: 0
      },
      Status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: 1 // 1= active, 0 = deactive
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