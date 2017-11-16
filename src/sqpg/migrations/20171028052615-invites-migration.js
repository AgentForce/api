'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('manulife_invites', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_invites', {
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
      leadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_leads',
          key: 'id',
          as: 'leadId',
        }
      },
      processStep: {
        allowNull: false,
        type: Sequelize.STRING(50),
        /*xem lại*/
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
    return queryInterface.dropTable('manulife_invites');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('manulife_invites');
    */
  }
};