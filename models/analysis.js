'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class analysis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  analysis.init({
    ph: DataTypes.FLOAT,
    cl: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'analysis',
  });
  return analysis;
};