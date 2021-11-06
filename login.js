var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var encoder = bodyParser.urlencoded();

const app = express();

// Add the credentials to access your database
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'admin12345',
    database : 'node'
});


connection.connect(function(err) {
    // in case of error
    if(err) throw err 
    else console.log("Connected")
});

app.use(session({
    secret: ':y&CvmV.,z(Zm64-',
    resave: false,
    saveUninitialized: true
  }));

app.get("/",function(req,res){
    if(req.session.email){
        res.sendFile(__dirname +"/welcome.html");
    }else{
        res.sendFile(__dirname +"/index.html");
    }

});

app.get("/welcome",function(req,res){

    if(req.session.email){
        res.sendFile(__dirname +"/welcome.html");
    }else{
        res.sendFile(__dirname +"/index.html");
    }
});


app.get("/forget",function(req,res){

   console.log('forget page');
        res.sendFile(`${__dirname}/forget.html`);
   
});


app.get("/signup",function(req,res){

    console.log('sign up page');
         res.sendFile(`${__dirname}/signup.html`);
    
 });


 app.post("/signup",encoder,function(req,res){

    var username = req.body.email;
    var password = req.body.password;

    if(req.session.email){
        console.log('session valid');
        res.redirect("/welcome");
    }else{
    connection.query("INSERT INTO `user` (`username`, `password`) VALUES (?,?) ", [username,password] ,function(error, result){
        
        if (error){

        }else{
        res.redirect("/");
        console.log("User Sign Up");
    }
        res.end();
   })
    }

 });


 app.post("/welcome",encoder,function(req,res){

  //  var username = req.body.email;
    var password = req.body.password;

    if(req.session.email){

        var username=req.session.email;
        console.log('session valid');

        connection.query("UPDATE user SET password = ? WHERE username = ?", [password,username] ,function(error, result){
        
            if (error){
    
            }else{
            res.redirect("/welcome");
            console.log("Password Reset");
        }
            res.end();
       })




        
    }else{
        res.redirect("/");
    }

 });





app.post("/", encoder,function(req,res){

    if(req.session.email){
        console.log('session valid');
        res.redirect("/welcome");
    }else{
        console.log('session invalid');
    var username = req.body.email;
    var password = req.body.password;
    console.log("recieved");

   connection.query("select * from user where username = ? and password = ?", [username,password] ,function(error, result, fields){
        if(result.length > 0){
            req.session.email = username;
            res.redirect("/welcome");
            console.log(username);
        }else{
            res.redirect("/");
            console.log("recieved2");
        }

        res.end();
   })
    }
});



app.listen(4500);