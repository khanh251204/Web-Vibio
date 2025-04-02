// const newsRouter= require("./managerUser")
const userRouter= require("./User")
const profileRouter = require("./profile")
const M404 = require("./404")


function route(app){
    app.use("/",userRouter);
    // app.use("/",newsRouter);
    app.use("/",profileRouter);
    app.use("/",M404);


   
}


module.exports = route;