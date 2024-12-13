import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

const sequelize = new Sequelize({
    dialect: MySqlDialect,
    database: 'ktpm_db',
    user: 'root',
    password: 'Viet211003@s',
    host: 'localhost',
    port: 3306,
});

// Kiểm tra kết nối đến cơ sở dữ liệu
const ConnectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};



export default ConnectDB;