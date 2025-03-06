'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Thêm ràng buộc giữa 'avatars' và 'users'
        await queryInterface.addConstraint('avatars', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_avatars_users_user_id',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'ware_houses' và 'books'
        await queryInterface.addConstraint('ware_houses', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_ware_houses_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'customers' và 'users'
        await queryInterface.addConstraint('customers', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_customers_users_user_id',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'books' và 'book_types'
        await queryInterface.addConstraint('books', {
            fields: ['book_type_id'],
            type: 'foreign key',
            name: 'fk_books_book_types_book_type_id',
            references: {
                table: 'book_types',
                field: 'book_type_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'orders' và 'customers'
        await queryInterface.addConstraint('orders', {
            fields: ['customer_id'],
            type: 'foreign key',
            name: 'fk_orders_customers_customer_id',
            references: {
                table: 'customers',
                field: 'customer_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'orders' và 'payment_methods'
        await queryInterface.addConstraint('orders', {
            fields: ['payment_method_id'],
            type: 'foreign key',
            name: 'fk_orders_payment_methods_payment_method_id',
            references: {
                table: 'payment_methods',
                field: 'payment_method_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'order_details' và 'orders'
        await queryInterface.addConstraint('order_details', {
            fields: ['order_id'],
            type: 'foreign key',
            name: 'fk_order_details_orders_order_id',
            references: {
                table: 'orders',
                field: 'order_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'order_details' và 'books'
        await queryInterface.addConstraint('order_details', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_order_details_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'reviews' và 'books'
        await queryInterface.addConstraint('reviews', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_reviews_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'reviews' và 'users'
        await queryInterface.addConstraint('reviews', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_reviews_users_user_id',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'book_images' và 'books'
        await queryInterface.addConstraint('book_images', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_book_images_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'carts' và 'users'
        await queryInterface.addConstraint('carts', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_carts_users_user_id',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'carts' và 'books'
        await queryInterface.addConstraint('carts', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_carts_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'favorites' và 'users'
        await queryInterface.addConstraint('favorites', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_favorites_users_user_id',
            references: {
                table: 'users',
                field: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Thêm ràng buộc giữa 'favorites' và 'books'
        await queryInterface.addConstraint('favorites', {
            fields: ['book_id'],
            type: 'foreign key',
            name: 'fk_favorites_books_book_id',
            references: {
                table: 'books',
                field: 'book_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        // Xóa tất cả ràng buộc đã thêm
        await queryInterface.removeConstraint('avatars', 'fk_avatars_users_user_id');
        await queryInterface.removeConstraint('customers', 'fk_customers_users_user_id');
        await queryInterface.removeConstraint('books', 'fk_books_book_types_book_type_id');
        await queryInterface.removeConstraint('ware_houses', 'fk_ware_houses_books_book_id');
        await queryInterface.removeConstraint('orders', 'fk_orders_customers_customer_id');
        await queryInterface.removeConstraint('orders', 'fk_orders_payment_methods_payment_method_id');
        await queryInterface.removeConstraint('order_details', 'fk_order_details_orders_order_id');
        await queryInterface.removeConstraint('order_details', 'fk_order_details_books_book_id');
        await queryInterface.removeConstraint('reviews', 'fk_reviews_books_book_id');
        await queryInterface.removeConstraint('reviews', 'fk_reviews_users_user_id');
        await queryInterface.removeConstraint('book_images', 'fk_book_images_books_book_id');
        await queryInterface.removeConstraint('carts', 'fk_carts_users_user_id');
        await queryInterface.removeConstraint('carts', 'fk_carts_books_book_id');
        await queryInterface.removeConstraint('favorites', 'fk_favorites_users_user_id');
        await queryInterface.removeConstraint('favorites', 'fk_favorites_books_book_id');
    },
};