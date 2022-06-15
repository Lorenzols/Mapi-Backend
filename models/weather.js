'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class weather extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  weather.init({
    ambient_temperature: DataTypes.FLOAT,
    pool_temperature: DataTypes.FLOAT,
    date_registration: DataTypes.DATE,
    fk_iduser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'weather',
  });
  return weather;
};