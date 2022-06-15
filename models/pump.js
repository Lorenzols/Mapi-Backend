'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pump extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pump.init({
    status: DataTypes.BOOLEAN,
    fk_idProductos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pump',
  });
  return pump;
};