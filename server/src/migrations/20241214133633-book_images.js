'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('book_images', {
      image_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      book_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      image_public_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('book_images');
  }
};
