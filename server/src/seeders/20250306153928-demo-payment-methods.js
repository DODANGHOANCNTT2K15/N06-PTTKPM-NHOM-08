"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("payment_methods", [
      {
        payment_method_id : 0,
        name: "Ví điện tử",
        description: "Thanh toán qua ví điện tử như Momo, ZaloPay",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        payment_method_id : 1,
        name: "Chuyển khoản ngân hàng",
        description: "Thanh toán qua tài khoản ngân hàng",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        payment_method_id : 2,
        name: "Thanh toán khi nhận hàng",
        description: "Khách hàng thanh toán tiền mặt khi nhận hàng",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("payment_methods", null, {});
  },
};
