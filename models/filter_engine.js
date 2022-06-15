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
      // define association here
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