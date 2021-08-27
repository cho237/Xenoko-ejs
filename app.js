const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://tejiz:1234@cluster0.cblz1.mongodb.net/xenoko'
const User= require('./models/user')
const dirname = require('./util/path')
const flash = require('connect-flash')

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection : 'sessions'
})

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(dirname,'public')));


app.set('view engine','ejs');
app.set('views','views');


app.use(session({
    secret: 'my secret',
    resave: 'false',
    saveUninitialized: false,
    store: store
}))

app.use(flash())
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next()
})
   

app.use(userRoutes);
app.use(authRoutes);


mongoose.connect(
    MONGODB_URI
).then(result=>{
     app.listen(7000)
})

.catch(err=>console.log(err))

