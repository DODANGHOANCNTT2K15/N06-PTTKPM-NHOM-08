'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BookImage extends Model {
    static associate(models) {
      BookImage.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    }
  }

  BookImage.init({
    image_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'BookImage',
    tableName: 'book_images',
    timestamps: false
  });

  return BookImage;
};
