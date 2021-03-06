'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class filtering extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      filtering.belongsTo(models.User, {foreignKey: 'fk_iduser'})
      filtering.hasMany(models.days_filtering, {foreignKey: 'fk_idfiltering'})
    }
  }
  filtering.init({
    time_on: DataTypes.DATE,
    time_off: DataTypes.DATE,
    fk_iduser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'filtering',
  });
  return filtering;
};