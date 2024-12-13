import route from "./route"

const initRoutes = (app) => {

    app.use('/api/v1/', route)
    
    return app.use('/', (req, res) => {
        // console.log("Server onl")
        res.json("Sever onl...")
    })
}

export default initRoutes