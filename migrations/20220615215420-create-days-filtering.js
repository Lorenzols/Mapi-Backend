'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('days_filterings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      monday: {
        type: Sequelize.BOOLEAN
      },
      tuesday: {
        type: Sequelize.BOOLEAN
      },
      wednesday: {
        type: Sequelize.BOOLEAN
      },
      thursday: {
        type: Sequelize.BOOLEAN
      },
      friday: {
        type: Sequelize.BOOLEAN
      },
      saturday: {
        type: Sequelize.BOOLEAN
      },
      sunday: {
        type: Sequelize.BOOLEAN
      },
      fk_idfiltering: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('days_filterings');
  }
};