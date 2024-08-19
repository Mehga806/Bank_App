//login function

//import model

const db= require('./db')

const jwt = require('jsonwebtoken')

const login = (acno,pswd)=>{

      console.log('inside login function definition');

         // check acno and pswd is present in mongodb

        return db.Account.findOne({
            acno,
            password:pswd
         }).then((result)=>{
           if(result){
            //acno and password is present in db
            console.log('login successfull');
            
          let currentAcno = acno 

            //generate token

            const token = jwt.sign({
              currentAcno: acno
            },'supersecretkey123')

            return{
              status: true,
              message: 'Login Successfull',
              username: result.username,
              
              statusCode: 200,
              token,
              currentAcno
            }
            
           }
           else{
            console.log('Invalid acno/pswd');

            return{
              status: false,
              message: 'Invalid Account Number/ Password',
              statusCode: 404
            }
           }
         })
}

// Register part


const register = (acno,pswd,uname)=>{

  console.log('inside register function definition');

     // check acno and pswd is present in mongodb

    return db.Account.findOne({
        acno
        
     }).then((result)=>{
       if(result){
        //acno is present in db
        console.log('Already Registered');

        return{
          status: false,
          message: 'Account already exists.. Please Login',
          statusCode: 404
        }
        
       }
       else{
        console.log('Registred successfully');
        
        let newAccount = new db.Account({
          acno,
          password: pswd,
          username: uname,
          balance: 0,
          transaction: []
        })
         newAccount.save()
        return{
          status: true,
          message: 'Account has been registred..',
          statusCode: 200
        }
       }
     })
}

// Deposit

const deposit = (req,acno,pswd,amount)=>{

  console.log('inside login function definition');

  let amt = Number(amount)

     // check acno and pswd is present in mongodb

    return db.Account.findOne({
        acno,
        password:pswd

     }).then((result)=>{
       if(result){
        //acno and password is present in db
        
        if(req.currentAcno!=acno){
          return{
            status: false,
            message: 'Operation Denied',
            statusCode: 404
          }
        }

        result.balance += amt
        result.transaction.push({
          type: "CREDIT",
          amount: amt
        })
        result.save()

        return{
          status: true,
          message: `${amt} depositted successfully`,
          statusCode: 200
        }
        
       }
       else{
        console.log('Invalid acno/pswd');

        return{
          status: false,
          message: 'Invalid Account Number/ Password',
          statusCode: 404
        }
       }
     })
}



// Withdraw

const withdraw = (req,acno,pswd,amount)=>{

  console.log('inside withdraw function definition');

  let amt = Number(amount)

     // check acno and pswd is present in mongodb

    return db.Account.findOne({
        acno,
        password:pswd

     }).then((result)=>{
       if(result){
        //acno and password is present in db
        
        if(req.currentAcno!=acno){
          return{
            status: false,
            message: 'Operation Denied..Please Login',
            statusCode: 404
          }
        }
        // check sufficient balance
        if(result.balance <amt){
          //insufficient balance
          return{
            status: false,
            message: 'Transaction failed. Insufficient balance.',
            statusCode: 404
          }

        }
        //withdraw

        result.balance -= amt
        result.transaction.push({
          type: "DEBIT",
          amount: amt
        })
        result.save()

        return{
          status: true,
          message: `${amount} Debitted Successfully`,
          statusCode: 200
        }
        
       }
       else{
        console.log('Invalid acno/pswd');

        return{
          status: false,
          message: 'Invalid Account Number/ Password',
          statusCode: 404
        }
       }
     })
}


// export login

module.exports={
    login,
    register,
    deposit,
    withdraw
}