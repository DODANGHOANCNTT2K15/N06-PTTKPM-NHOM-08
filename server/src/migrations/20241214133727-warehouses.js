'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ware_houses', {
            ware_house_id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            book_id: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            stock_quantity: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            sold_quantity: {
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
        await queryInterface.dropTable('ware_houses');
    }
};