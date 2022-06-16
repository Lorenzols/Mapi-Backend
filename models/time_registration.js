'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class time_registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      time_registration.belongsTo(models.filter_engine, {foreignKey: 'fk_idfilter_engine'})
    }
  }
  time_registration.init({
    time_on: DataTypes.DATE,
    time_off: DataTypes.DATE,
    fk_idfilter_engine: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'time_registration',
  });
  return time_registration;
};