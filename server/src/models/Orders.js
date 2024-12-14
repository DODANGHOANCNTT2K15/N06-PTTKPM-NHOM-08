'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
      Order.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id', as: 'paymentMethod' });
      Order.hasMany(models.OrderDetail, { foreignKey: 'order_id', as: 'orderDetails' });
    }
  }

  Order.init({
    order_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_price: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false
  });

  return Order;
};
