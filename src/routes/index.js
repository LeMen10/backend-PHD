const userRouter = require('./user')

const route = (app) => {
    app.use('/', userRouter)
}

module.exports = route;