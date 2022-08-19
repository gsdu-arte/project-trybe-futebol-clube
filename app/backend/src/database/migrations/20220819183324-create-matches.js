'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      homeTeam: {
        type: Sequelize.INTEGER,
        field: 'home_team',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        }
      },
      homeTeamGoals:{
        type: Sequelize.INTEGER,
        field: 'home_team_goals',
        allowNull: false,
      },
      awayTeam: {
        type: Sequelize.INTEGER,
        field: 'away_team',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        }
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
        field: 'away_team-goals',
        allowNull: false,
      },
      inProgress: {
        type: Sequelize.INTEGER,
        field: 'in_progress',
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches');
  }
};
