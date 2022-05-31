const express = require('express');
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const ejs = require('ejs');
const md5 = require('md5');

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const uri = "mongodb+srv://admin-mikolaj:9LQ0aKsNdMYxf5OB@cluster0.9xk9u.mongodb.net/movix";


mongoose.connect(uri);


const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    accountType: String
})

const Users = mongoose.model('User', userSchema);



app.get('/', (req, res) => {
    res.render('home', {title: "Movix"});
});

app.get('/login', (req, res) => {
    res.render('login', {title: "Login"});
});

app.post('/login', (req, res) => {
    const login = req.body?.login;
    const password = md5(req.body?.password);
    try{
    console.log(Users.findOne({login: login, password: password}, (err, user)=>{
        if(err){
            res.render('login', {title: "Login"})
        }else{
            if(user) {
                console.log(user.login);
                res.redirect('/');
            }else{
                res.render('login', {title: "Login"});
            }
        }
    }));
    }catch(err){
        console.log(err);
    };

});

app.get('/register', (req, res) => {
    res.render('register', {title: "Register"});
});

app.post('/register', (req, res) => {
    let login = req.body.login;
    let password = md5(req.body.password);
    Users.insertMany({login: login, password: password}, (err)=>{
    err ? res.render('register', {title: "Register"}) : res.redirect('login');
    });
});















app.listen(3000, ()=>{
    console.log("App is up");
});