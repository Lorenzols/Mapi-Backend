'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weather', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ambient_temperature: {
        type: Sequelize.FLOAT
      },
      pool_temperature: {
        type: Sequelize.FLOAT
      },
      date_registration: {
        type: Sequelize.DATE
      },
      fk_iduser: {
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
    await queryInterface.dropTable('weather');
  }
};