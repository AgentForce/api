"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
// const Sequelize = require('sequelize');
const Sequelize = require("sequelize");
const Invite = db_1.db.define('manulife_invites', {
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
}, {
    // tableName: 'campaign',
    // schema: 'testmanulife',
    // freezeTableName: true,
    // timestamps: false
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
});
exports.Invite = Invite;
//# sourceMappingURL=invite.js.map