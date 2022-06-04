const express = require('express');
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
const ejs = require('ejs');
const md5 = require('md5');
const cookieParser = require('cookie-parser');
const { clearCookie } = require('express/lib/response');
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const uri = "mongodb+srv://admin-mikolaj:9LQ0aKsNdMYxf5OB@cluster0.9xk9u.mongodb.net/movix";


mongoose.connect(uri);


const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    accountType: String
});

const movieSchema = new mongoose.Schema({
    name: String,
    director: String,
    poster: String,
    length: Number,
});

const Users = mongoose.model('User', userSchema);
const Movies = mongoose.model('Movie', movieSchema);


app.get('/', (req, res) => {
    Movies.find((err, movies)=>{
        if(err){
            console.log(err);
            res.render('home', {title: "Movix", movies: [], loggedCookie: checkIfLogged(req)});
        }else{
            if(movies){
                if (checkIfLogged){
                res.render('home', {title: "Movix", movies: movies, loggedCookie: checkIfLogged(req)});
                }else{
                    res.send('Something went wrong');
                }
            }
        }
    });
});

app.get('/login', (req, res) => {
    checkIfLogged(req) ? res.redirect('/') : res.render('login', {title: "Login", loggedCookie: checkIfLogged(req)});
});

app.post('/login', (req, res) => {
    const login = req.body?.login;
    const password = md5(req.body?.password);
    try{
    console.log(Users.findOne({login: login, password: password}, (err, user)=>{
        if(err){
            res.render('login', {title: "Login", loggedCookie: checkIfLogged(req)});
        }else{
            if(user) {
                res.cookie('_logged', login, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true })
                res.redirect('/');
            }else{
                res.render('login', {title: "Login", loggedCookie: checkIfLogged(req)});
            }
        }
    }));
    }catch(err){
        console.log(err);
    };
});

app.get('/register', (req, res) => {
    checkIfLogged(req) ? res.redirect('/') : res.render('register', {title: "Register", loggedCookie: checkIfLogged(req)});
});

app.post('/register', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    Users.insertMany({login: login, password: md5(password)}, (err)=>{
    err ? res.render('register', {title: "Register", loggedCookie: checkIfLogged(req)}) : res.redirect('login');
    });
});

app.get('/movies', (req, res) => {
    try{
    Movies.find((err,movies)=>{
        if(!err) res.render('movies', {title: "Movies", loggedCookie: checkIfLogged(req), movies: movies});
    });
    }catch{}
});

app.get('/logout', (req, res) => {
    if(checkIfLogged(req)){
        logout(res);
        res.redirect('/');
    }else{
        res.redirect('login');
    }
});



function checkIfLogged(req){
   return req.cookies["_logged"] ? true : false;
}
function logout(res){
    res.clearCookie('_logged');
}












app.listen(3000, ()=>{
    console.log("App is up");
});