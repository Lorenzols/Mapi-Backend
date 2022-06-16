'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products_registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products_registration.belongsTo(models.Products, {foreignKey: 'fk_idProducts'})
    }
  }
  products_registration.init({
    value: DataTypes.FLOAT,
    date_registration: DataTypes.DATE,
    fk_idProducts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products_registration',
  });
  return products_registration;
};