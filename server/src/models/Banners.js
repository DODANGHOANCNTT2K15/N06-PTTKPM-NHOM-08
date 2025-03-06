'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Banner extends Model {
    static associate(models) {
      // Define associations here if needed
      // Example: Banner.hasMany(models.Campaign, { foreignKey: 'banner_id', as: 'campaigns' });
    }
  }

  Banner.init({
    banner_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    banner_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banner_public_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    banner_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Banner',
    tableName: 'banners',
    timestamps: true,
  });

  return Banner;
};