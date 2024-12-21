import express from "express"
require('dotenv').config()
import ConnectCRDB from "./src/config/connectCRDB.js"
// import ConnectMSQL from "./src/config/connectMSQL.js"
import cors from "cors"
import initRoutes from "./src/routes/index.js" // khởi tạo tất cả các route

// khởi tạo app
const app = express()

app.use(cors(
    {
        origin: "*",
        methods: ["POST", 'GET', 'PUT', "DELETE"]
    }
))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// khởi tạo router và kết nối tới cơ sỏ dữ liệu
initRoutes(app)
ConnectCRDB()
// ConnectMSQL()

const port = process.env.PORT || 2025
const listener = app.listen(port, () => {
    console.log(`Server is running on ${listener.address().port}.....`)
})