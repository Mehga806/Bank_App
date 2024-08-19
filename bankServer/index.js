// using express , create server

// 1. import express

const express = require('express')

// import service file

const dataService = require('./services/data.service')

// import cors

const cors = require('cors')

//import JWT

const jwt = require('jsonwebtoken')


// 2. create a server app using express

const app = express()


//using cords define origin to server app

app.use(cors({
    origin: ['http://localhost:4200']
}))


//to parse json data

app.use(express.json())

// 3. setup port for server app

app.listen(3000, ()=>{
    console.log('Server started at port 3000');
})


//application specific middleware

const appMiddleware =(req,res,next)=>{
    console.log('application specific middleware');
    next()
}
app.use(appMiddleware)

//router specific middleware - token validation

const jwtMiddleware = (req, res, next)=>{
    console.log('inside router specific middleware');
    let token = req.headers["x-access-token"]
    //verify token using jwt
   try {
        let data  = jwt.verify(token, "supersecretkey123");
        req.currentAcno = data.currentAcno;
        next();
    }
    catch{
        res.status(404).json({
            status: false,
            message: "Authentication Failed..Please Login..."
        });
      
    }  

};


// http Request

// app.get('/',(req,res)=>{
//       res.send("GET METHOD")
// })


// app.post('/',(req,res)=>{
//     res.send("POST METHOD")
// })

// app.put('/',(req,res)=>{
//     res.send("PUT METHOD")
// })

// app.patch('/',(req,res)=>{
//     res.send("PATCH METHOD")
// })

// app.delete('/',(req,res)=>{
//     res.send("DELETE METHOD")
// })





// HTTP request - REST API - BANK API

//1. login API

app.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
//  res.send("login called")
   
})

//2. Register API

app.post('/register',(req,res)=>{
    console.log('inside register function');
    console.log(req.body);
    dataService.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

   
})

//3. Deposit API

app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('inside deposit function');
    console.log(req.body);
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

   
})


//4. Withdraw API

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log('inside withdraw function');
    console.log(req.body);
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })

   
})

