// connection between server and mongodb

//1. import mongoose

 const mongoose = require ('mongoose')


 //2. define connection string

 mongoose.connect('mongodb://localhost:27017/Bank').then(()=>{
    console.log('MongoDB connected successfully');
 })


 //3. create model

 const Account = mongoose.model('Account',{
            acno: Number,
            password: String,
            username: String,
            balance: Number,
            transaction: []
 })

 // 4. export model

 module.exports={
    Account
 }