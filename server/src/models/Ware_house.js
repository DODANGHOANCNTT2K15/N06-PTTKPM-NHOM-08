'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class WareHouse extends Model {
    static associate(models) {
      WareHouse.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    }
  }

  WareHouse.init({
    ware_house_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    stock_quantity: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sold_quantity: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'WareHouse',
    tableName: 'ware_houses',
    timestamps: true,
  });

  return WareHouse;
};