'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsTo(models.User, {foreignKey: 'fk_iduser'})
      Products.hasMany(models.products_registration, {foreignKey: 'fk_idProducts'})
      Products.hasOne(models.pump, {foreignKey: 'fk_idProductos'})
    }
  }
  Products.init({
    name: DataTypes.STRING,
    deposit: DataTypes.FLOAT,
    appropriate_value: DataTypes.FLOAT,
    dosage_recommend_ml: DataTypes.INTEGER,
    dosage_recommend_mc: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};