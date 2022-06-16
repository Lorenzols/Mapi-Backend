'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Products, {foreignKey: 'fk_iduser'})
      User.hasMany(models.filtering, {foreignKey: 'fk_iduser'})
      User.hasOne(models.weather, {foreignKey: 'fk_iduser'})
      User.hasOne(models.configuration, {foreignKey: 'fk_iduser'})
      User.hasOne(models.filter_engine, {foreignKey: 'fk_iduser'})
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    tokenresetpassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};