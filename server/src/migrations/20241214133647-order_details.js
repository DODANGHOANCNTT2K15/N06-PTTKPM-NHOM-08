'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      order_detail_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      book_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      quantity: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      price: {
        type: Sequelize.BIGINT,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_details');
  }
};
