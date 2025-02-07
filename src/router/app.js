const newsRouter= require("./managerUser")
const userRouter= require("./User")
const managerRouter = require("./manager")
const productRouter = require("./product")
const cartRouter = require("./cart") 

function route(app){
    app.use("/",userRouter);
    app.use("/",newsRouter);
    app.use("/",managerRouter);
    app.use("/",productRouter);
    app.use("/",cartRouter);


   
}


module.exports = route;