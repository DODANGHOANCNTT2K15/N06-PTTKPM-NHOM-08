'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      book_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publisher: {
        type: Sequelize.STRING,
        allowNull: true
      },
      published_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      price: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      rating_avg: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      discount_price: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cover_image: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      book_type_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  }
};
