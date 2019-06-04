const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session') // for saving cookies : more session id
const cors = require('cors')              // for having or sending req across diff domains
const mongoose = require('mongoose')
const errorHandeler = require('errorhandler')

//MOdules & routes
require('./models/User');
require('./config/passport');
//app.use(require('./routes'));
// to global variable

mongoose.promise = global.Promise;


// 
const isProduction = process.env.NODE_ENV === 'production';


//Initiate our app
const app = express();

//config
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    secret: 'passport', 
    cookie:{
        maxAge: 60000
    }, 
    resave: false, 
    saveUninitialized: false
}));

//MOdules & routes
// require('./models/User');
// require('./config/passport');
app.use(require('./routes'));
if(!isProduction){
    app.use(errorHandeler());
}

const MongoClient = require('mongodb').MongoClient
MongoClient.connect("mongodb://localhost:27017/YourDB", { useNewUrlParser: true },()=>{
    console.log('mongodb connect');
})

// //MOdules & routes
// require('./models/User');
// require('./config/passport');
// app.use(require('./routes'));


if(!isProduction){
    app.use(function errorHandeler (err,req,res){
        res.status(err.status || 500);

        res.json({
            erros:{
                message:err.message,
                error: err
            },
        });
    });
}

app.use((err, req, res,next) => {
    res.status(err.status || 500);
  
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });

  app.listen(8000, function(){ console.log('Server running on http://localhost:8000/')});