'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      delivery_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivery_price: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      total_price: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      payment_method_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      payment_status: {
        type: Sequelize.BIGINT,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
