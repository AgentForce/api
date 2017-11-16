'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('manulife_campaigns', {
      Id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'manulife_users',
          key: 'Id',
          as: 'camp_userId'
        }
      },
      Period: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      CampType: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      StartDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      EndDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      TargetCallSale: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetMetting: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetPresentation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetContractSale: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetContractSale: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CommissionRate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CaseSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      IncomeMonthly: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentCallSale: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentMetting: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentPresentation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurentContract: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetCallReCruit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetSurvey: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetPamphlet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetCop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetTest: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetInterview: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetMit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      TargetAgentCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Description: {
        type: Sequelize.STRING(500)
      },
      CurrentCallRecruit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentSurvey: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentPamphlet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentCop: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentTest: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentInterview: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurrentMit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      CurentTer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      AgentTer: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      ActiveRaito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      M3AARaito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      AverageCC: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      M3AA: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      FypRaito: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      Results: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0 //0 chưa đặt, 1 đạt
      },
      ReportTo: {
        type: Sequelize.INTEGER
      },
      ReportToList: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      CreateAt: {
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