'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.BookType, { foreignKey: 'book_type_id', as: 'bookType' });
      Book.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
      Book.hasMany(models.WareHouse, { foreignKey: 'book_id', as: 'warehouses' });
      Book.hasMany(models.OrderDetail, { foreignKey: 'book_id', as: 'orderDetails' });
      Book.hasMany(models.BookImage, { foreignKey: 'book_id', as: 'images' });
    }
  }

  Book.init({
    book_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rating_avg: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    discount_price: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
  });

  return Book;
};
