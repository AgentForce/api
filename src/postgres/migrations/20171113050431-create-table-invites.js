'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_invites', {
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
          as: 'invites_users'
        }
      },
      LeadId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_leads',
          key: 'Id',
          as: 'invites_leads'
        }
      },
      ProcessStep: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      UserIdInvite: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_users',
          key: 'Id',
          as: 'invites_user_invited'
        }
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
      Status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 // 0 = khong chap nhat, 1 = chap nhan
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