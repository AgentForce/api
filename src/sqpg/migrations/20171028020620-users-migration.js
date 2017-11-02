'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_users', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      label: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      groupId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      reportTo: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      reportToFather: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
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
    return queryInterface.dropTable('manulife_users');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
