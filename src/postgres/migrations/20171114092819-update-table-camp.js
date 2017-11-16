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
      queryInterface.addColumn('manulife_campaigns', 'Label', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
      queryInterface.addColumn('manulife_campaigns', 'Experience', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
    ]
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