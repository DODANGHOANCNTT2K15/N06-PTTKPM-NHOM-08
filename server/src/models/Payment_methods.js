'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.hasMany(models.Order, { foreignKey: 'payment_method_id', as: 'orders' });
    }
  }

  PaymentMethod.init({
    payment_method_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'payment_methods',
    timestamps: false
  });

  return PaymentMethod;
};
