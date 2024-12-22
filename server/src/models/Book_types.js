'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BookType extends Model {
    static associate(models) {
      BookType.hasMany(models.Book, { foreignKey: 'book_type_id', as: 'books' });
    }
  }

  BookType.init({
    book_type_id: {
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
    modelName: 'BookType',
    tableName: 'book_types',
    timestamps: true,
  });

  return BookType;
};
