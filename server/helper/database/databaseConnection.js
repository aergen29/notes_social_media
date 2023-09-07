const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

const databaseConnection = ()=>{
    mongoose.connect(MONGO_URI)
    .then(res=>console.log("Database connection is successful"))
    .catch(err=>console.log(err))
}

module.exports = databaseConnection;