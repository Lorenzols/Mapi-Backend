'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class configuration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      configuration.belongsTo(models.User, {foreignKey: 'fk_iduser'})
    }
  }
  configuration.init({
    pool_location_latitud: DataTypes.FLOAT,
    pool_location_longitud: DataTypes.FLOAT,
    filtering_auto: DataTypes.BOOLEAN,
    treatment_auto: DataTypes.BOOLEAN,
    meters_cubics_pool: DataTypes.INTEGER,
    initial_treatment_time: DataTypes.DATE,
    fk_iduser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'configuration',
  });
  return configuration;
};