'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });

    */
    return queryInterface.createTable('manulife_users', {
      Id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      UserName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      Password: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      GroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_groups',
          key: 'Id'
        }
      },
      Email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Phone: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      FullName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Address: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      City: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      District: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Gender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      Birthday: {
        type: Sequelize.DATE,
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
      Label: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      Status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true // 1= active, 0 = deactive
      },
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('manulife_users');
  }
};