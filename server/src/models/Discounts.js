'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Discount extends Model {
    static associate(models) {
      // Define associations here if needed
      // Example: Discount.hasMany(models.Order, { foreignKey: 'discount_id', as: 'orders' });
    }
  }

  Discount.init({
    discount_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    discount_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    percent_discount: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Discount',
    tableName: 'discounts',
    timestamps: true,
  });

  return Discount;
};