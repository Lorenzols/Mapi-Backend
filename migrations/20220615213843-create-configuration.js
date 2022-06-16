'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pool_location_latitud: {
        type: Sequelize.FLOAT
      },
      pool_location_longitud: {
        type: Sequelize.FLOAT
      },
      filtering_auto: {
        type: Sequelize.BOOLEAN
      },
      treatment_auto: {
        type: Sequelize.BOOLEAN
      },
      meters_cubics_pool: {
        type: Sequelize.INTEGER
      },
      initial_treatment_time: {
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
    await queryInterface.dropTable('configurations');
  }
};