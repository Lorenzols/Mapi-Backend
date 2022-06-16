'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class days_filtering extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      days_filtering.belongsTo(models.filtering, {foreignKey: 'fk_idfiltering'})
    }
  }
  days_filtering.init({
    monday: DataTypes.BOOLEAN,
    tuesday: DataTypes.BOOLEAN,
    wednesday: DataTypes.BOOLEAN,
    thursday: DataTypes.BOOLEAN,
    friday: DataTypes.BOOLEAN,
    saturday: DataTypes.BOOLEAN,
    sunday: DataTypes.BOOLEAN,
    fk_idfiltering: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'days_filtering',
  });
  return days_filtering;
};