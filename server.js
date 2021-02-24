if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
const passport = require('passport')
initializePassport(passport, email => users.find(user=> user.email === email),
id => users.find(user => user.id === id)
);

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res)=>{
    res.render('index.ejs', {name: req.user.name})
});

app.get('/login', checkNotAuthnticated,(req, res)=>{
    res.render('login.ejs')
});

app.post('/login',checkNotAuthnticated ,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthnticated,(req, res)=>{
    res.render('register.ejs')
});

app.post('/register', checkNotAuthnticated,async (req, res)=>{
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
        id: Date.now().toString(),//do not need to add this if you have a data base
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    res.redirect('/login')

} catch (error) {
    res.redirect('/register')
    
}
console.log(users)
})

function checkAuthenticated(req, res , next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect()
}

function checkNotAuthnticated(req, res, next){
    if (req.isAuthenticated()){
       return res.redirect('/')
    }
    next()
}

app.listen(3000, console.log('listening port 3000'));