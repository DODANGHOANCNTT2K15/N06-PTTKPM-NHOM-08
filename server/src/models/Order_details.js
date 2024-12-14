'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrderDetail extends Model {
    static associate(models) {
      OrderDetail.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      OrderDetail.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    }
  }

  OrderDetail.init({
    order_detail_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    quantity: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_details',
    timestamps: false
  });

  return OrderDetail;
};
