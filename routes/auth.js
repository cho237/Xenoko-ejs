const expres = require('express')
const Router = expres.Router()
const authController = require('../controllers/auth');   
const {check,body} = require('express-validator/check');
const { Promise } = require('mongoose');
const User = require("../models/user");

Router.get('/login',authController.getLogin);

Router.post('/login',authController.postLogin);

Router.post('/logout',authController.postLogout);

Router.get('/signUp',authController.getSignUp);

Router.post('/signUp',
[
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value,{req})=>{
            return User.findOne({email: value})
                .then(userDoc =>{
                    if(userDoc){
                        return Promise.reject('Email already used ,chose another email');
                    }
                })
            })
        .normalizeEmail(),
        body('password',
        'please enter password with only numbers and text with at least 5 characters'
        )
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),    
]
,authController.postSignUp);

Router.get('/reset',authController.getReset)

Router.post('/reset',authController.postReset)

Router.get('/reset/:token',authController.getNewPassword);

Router.post('/new-password' , authController.postNewPassword)

module.exports = Router
