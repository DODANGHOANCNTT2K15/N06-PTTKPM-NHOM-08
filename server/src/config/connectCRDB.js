import { Sequelize } from 'sequelize-cockroachdb';
require('dotenv').config()


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', 
  logging: false 
});


// Kiểm tra kết nối đến cơ sở dữ liệu
const ConnectCRDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

const executeQuery = async () => {
  try {
    const [results, metadata] = await sequelize.query("SELECT NOW()");
  } catch (err) {
    console.error("Error executing query:", err);
  }
};

(async () => {
  try {
    await ConnectCRDB();

    // Thực hiện các truy vấn cơ sở dữ liệu khi cần thiết
    await executeQuery();
    await executeQuery(); 

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Đóng kết nối khi ứng dụng dừng hoặc khi không cần thiết nữa
    await sequelize.close();
  }
})();

export default ConnectCRDB