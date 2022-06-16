'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class filter_engine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      filter_engine.belongsTo(models.User, {foreignKey: 'fk_iduser'})
      filter_engine.hasMany(models.time_registration, {foreignKey: 'fk_idfilter_engine'})
    }
  }
  filter_engine.init({
    status: DataTypes.BOOLEAN,
    fk_iduser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'filter_engine',
  });
  return filter_engine;
};