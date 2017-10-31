'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
        Example:
      return queryInterface.createTable('manulife_events', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_events', {
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
          as: 'userId'
        }
      },
      eventType: {
        allowNull: false,
        type: Sequelize.STRING(50)
        /*Gold meeting: FA - SM
        ....*/
      },
      processStep: {
        allowNull: false,
        type: Sequelize.STRING(50)
        /*xem lại*/
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(1024),
        unique: true
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      district: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reportTo: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      isStatus: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('manulife_events');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
        Example:
      return queryInterface.dropTable('manulife_events');
    */
  }
};