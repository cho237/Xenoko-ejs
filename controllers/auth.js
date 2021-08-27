const User = require("../models/user");
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const {validationResult} = require('express-validator')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'kinslycho237@gmail.com',
        pass:'atenchong'
    }
})


exports.getLogin = (req,res,next)=>{
    let message = req.flash('error')
    if(message.length>0){
        message = message[0];
      }else{
        message = null;
      }
    res.render('auth/login',{
        pageTitle: 'Login',
        path:'/login',
        errorMessage : message
    })
}



exports.postLogin = (req,res,next)=>{
    const email = req.body.email
    const password = req.body.password
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            req.flash('error','unvailable password or email')
            return res.redirect('/login')
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
           if(doMatch){
               
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                console.log(err);
                res.redirect('/');
              });
             
              res.redirect('/')
           } 
           req.flash('error','unvailable password or email')
          res.redirect('/login')
        })
        .catch(err=>{
            console.log(err)
            res.redirect('/login')
        })
    })
    
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/login')
    });

}

exports.getSignUp = (req,res,next)=>{
    res.render('auth/signUp',{
        pageTitle: 'SignUp',
        path:'/signUp',
        errorMessage: null,
        validationErrors: []    
    })
}

exports.postSignUp =(req,res,next)=>{
   
   const errors = validationResult(req)
   console.log(errors)
   if(!errors.isEmpty()){
    return res.render('auth/signUp',{
        pageTitle: 'SignUp',
        path:'/signUp',
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()    
    })
   }
   const email = req.body.email
   const password = req.body.password

       return bcrypt.hash(password,12)
       .then(hashedPassword=>{
        const user = new User({
            email : email,
            password: hashedPassword
       })
           return user.save()
       })
        .then(result=>{
        res.redirect('/login')
        transporter.sendMail({
            from: 'kinslycho237@gmail.com',
            to: email,
            subject: 'Xeneko account Created',
            html: `<h1>Welcome To Xenoko</h1>
            <p>Your Account was successfully created</p>`       
        })
    })
    .catch(err=>console.log(err))  
    
     
   .catch(err=>console.log(err)) 
 }

exports.getReset = (req,res,next)=>{
    let message = req.flash('error')
    if(message.length>0){
        message = message[0];
      }else{
        message = null;
      }
    res.render('auth/reset',{
        pageTitle: 'Reset Password',
        path:'/reset',
        errorMessage:message
    }) 
}

exports.postReset = (req,res,next) =>{
    const email = req.body.email
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
            return res.redirect('/reset')
        }
    
    const token = buffer.toString('hex')
   
    User.findOne({email:email})
    .then(user=>{
        
        if(!user){
            req.flash('error','no such user available');
            return res.redirect('/reset')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
    }).then(result=>{
        res.redirect('/login')
        transporter.sendMail({
            from: 'kinslycho237@gmail.com',
            to: email,
            subject: 'Xeneko account Password Reset',
            html: `<h1>You requested a password reset</h1>
            <p>Click this <a href="http://localhost:7000/reset/${token}">link</a> to set a new password.</p>`
        })
    })
    .catch(err=>console.log(err))
})
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;

    User.findOne({resetToken:token , resetTokenExpiration:{ $gt: Date.now() }})
    .then(user=>{
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        }); 
    })
    .catch(err=>console.log(err))
}

exports.postNewPassword = (req,res,next) =>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken : passwordToken , 
        resetTokenExpiration:{ $gt: Date.now() },
        _id : userId
    }).then(user=>{
        resetUser = user;
        return bcrypt.hash(newPassword,12)    
    }).then(hashedPassword=>{
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        resetUser.password = hashedPassword;
        return resetUser.save()
    }).then(result=>{
        res.redirect('/login')
    }).catch(err=>console.log(err))
}